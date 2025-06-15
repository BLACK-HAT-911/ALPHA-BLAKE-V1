const logger = require('../lib/logger');

module.exports = (sock) => {
  sock.ev.on('presence.update', async (update) => {
    try {
      const { id, presences } = update;
      
      for (const [userId, presence] of Object.entries(presences)) {
        const presenceType = presence.lastKnownPresence;
        
        switch (presenceType) {
          case 'composing':
            logger.info(`📝 ${userId} is typing in ${id}`);
            break;
            
          case 'recording':
            logger.info(`🎙️ ${userId} is recording a voice message in ${id}`);
            break;
            
          case 'paused':
            logger.info(`⏸️ ${userId} stopped typing or recording in ${id}`);
            break;
            
          case 'available':
            logger.info(`✅ ${userId} is online in ${id}`);
            break;
            
          case 'unavailable':
            logger.info(`🚫 ${userId} went offline in ${id}`);
            break;
            
          default:
            logger.info(`📡 ${userId} changed presence to ${presenceType} in ${id}`);
            break;
        }
      }
    } catch (error) {
      logger.error('❌ Error in presenceHandler:', error);
    }
  });
};