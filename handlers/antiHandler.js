const {
  isGroup,
  isViewOnce,
  isLink,
  extractMentions
} = require('../lib/functions');

const {
  handleAntiLink,
  handleAntiViewOnce,
  handleAntiDelete,
  handleAntiMention
} = require('../lib/antiUtils');

const config = require('../lib/config');
const logger = require('../lib/logger');

module.exports = (sock) => {
  // View Once Interceptor
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg || msg.key.fromMe || !msg.message) return;
    
    try {
      if (isGroup(msg) && isViewOnce(msg)) {
        await handleAntiViewOnce(sock, msg);
      }
      
      const textMsg = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
      if (isGroup(msg) && isLink(textMsg)) {
        await handleAntiLink(sock, msg, textMsg);
      }
      
      if (isGroup(msg)) {
        const mentions = extractMentions(msg);
        if (mentions.includes(sock.user.id)) {
          await handleAntiMention(sock, msg);
        }
      }
    } catch (err) {
      logger.error('🛡️ Error in antiHandler (messages.upsert):', err);
    }
  });
  
  // Delete Interceptor
  sock.ev.on('messages.delete', async (deletion) => {
    try {
      const { remoteJid, messages } = deletion;
      const msg = messages[0];
      if (!msg || msg.key.fromMe || !isGroup(msg)) return;
      
      await handleAntiDelete(sock, msg, remoteJid);
    } catch (err) {
      logger.error('🛡️ Error in antiHandler (messages.delete):', err);
    }
  });
};