// eventsHandler.js - Handles all core WhatsApp events

const { getContentType } = require('@whiskeysockets/baileys');
const messageHandler = require('../lib/messageHandler');
const groupUtils = require('../lib/groupUtils');
const antiUtils = require('../lib/antiUtils');
const logger = require('../lib/logger');
const config = require('../lib/config');
const store = require('../lib/store');

module.exports = (sock) => {
  logger.info('✅ Event handler initialized for ALPHA-BLAKE-V1');
  
  // Handle new messages
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    const msg = messages[0];
    if (!msg || !msg.message || msg.key.fromMe) return;
    
    try {
      await messageHandler(sock, msg);
    } catch (err) {
      logger.error('❌ Error handling message:', err);
    }
  });
  
  // Handle group participants update (join/leave/promote/demote)
  sock.ev.on('group-participants.update', async (update) => {
    try {
      await groupUtils.handleGroupParticipants(sock, update);
    } catch (err) {
      logger.error('❌ Error handling group update:', err);
    }
  });
  
  // Handle call blocks
  sock.ev.on('call', async (callData) => {
    if (!config.callBlock) return;
    for (const call of callData) {
      await sock.sendMessage(call.from, { text: '📵 Calls are not allowed. You will be blocked automatically.' });
      await sock.updateBlockStatus(call.from, 'block');
      logger.warn(`Blocked user for calling: ${call.from}`);
    }
  });
  
  // Handle message deletions (anti-delete)
  sock.ev.on('messages.delete', async (del) => {
    try {
      await antiUtils.handleAntiDelete(sock, del);
    } catch (err) {
      logger.error('❌ Error in anti-delete:', err);
    }
  });
  
  // Handle presence updates (for auto-recording/typing)
  sock.ev.on('presence.update', async (presence) => {
    try {
      if (config.autoPresence) {
        // You could expand this to reflect autotyping or autorecord features
        logger.info(`📶 Presence update from ${presence.id}: ${presence.presences}`);
      }
    } catch (err) {
      logger.error('❌ Error in presence update:', err);
    }
  });
  
  // Connection status logs
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      logger.warn('⚠️ Connection closed. Reconnecting...');
    } else if (connection === 'open') {
      logger.success('✅ Connection established. ALPHA-BLAKE-V1 is now online.');
    }
  });
};