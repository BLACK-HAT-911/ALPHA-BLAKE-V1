const { WA_DEFAULT_EPHEMERAL } = require('@whiskeysockets/baileys');
const logger = require('../lib/logger');
const { sendText } = require('../lib/functions');
const config = require('../lib/config');

module.exports = (sock) => {
  sock.ev.on('call', async (callEvents) => {
    for (const call of callEvents) {
      try {
        const callerId = call.from;
        const isOffer = call.status === 'offer';
        
        if (isOffer) {
          logger.warn(`⚠️ Incoming call from: ${callerId}`);
          
          // Send warning to caller
          await sendText(sock, callerId,
            `🚫 *Do not call this bot!*\n\nCalling will get you *auto-blocked*. If this was a mistake, message the owner for unblocking.\n\n⚙️ *Powered by ALPHA-BLAKE-V1*`);
          
          // Optionally block the user (uncomment below to enable auto-block)
          if (config.AUTO_BLOCK_ON_CALL) {
            await sock.updateBlockStatus(callerId, 'block');
            logger.info(`🔒 Blocked user: ${callerId} for calling.`);
          }
          
          // Optionally send message to owner
          if (config.FORWARD_CALL_ALERT_TO_OWNER) {
            const ownerId = config.OWNER_NUMBER;
            await sendText(sock, ownerId,
              `📞 *Call Alert:*\nUser @${callerId.split('@')[0]} attempted to call the bot.`,
              [callerId]);
          }
        }
      } catch (err) {
        logger.error('❌ Error in callHandler:', err);
      }
    }
  });
};