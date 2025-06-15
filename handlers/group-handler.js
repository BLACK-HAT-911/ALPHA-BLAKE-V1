const { getGroupMetadata, getUserName } = require('../lib/groupUtils');
const { WELCOME_ENABLED, GOODBYE_ENABLED } = require('../lib/config');
const logger = require('../lib/logger');

module.exports = (sock) => {
  sock.ev.on('group-participants.update', async (update) => {
    try {
      const { id: groupId, participants, action } = update;
      const metadata = await getGroupMetadata(sock, groupId);
      
      for (const participant of participants) {
        const userName = await getUserName(sock, participant);
        const ppUrl = await sock.profilePictureUrl(participant, 'image').catch(() => 'https://i.imgur.com/3NfFZtY.jpg');
        const groupName = metadata.subject;
        
        // WELCOME MESSAGE
        if (action === 'add' && WELCOME_ENABLED.includes(groupId)) {
          const welcomeText = `👋 Welcome @${participant.split('@')[0]} to *${groupName}*!\n\nWe're glad to have you here. Make sure to follow the rules or face the wrath of ALPHA-BLAKE-V1.`;
          await sock.sendMessage(groupId, {
            image: { url: ppUrl },
            caption: welcomeText,
            mentions: [participant],
          });
        }
        
        // GOODBYE MESSAGE
        if (action === 'remove' && GOODBYE_ENABLED.includes(groupId)) {
          const goodbyeText = `😤 @${participant.split('@')[0]} just got booted from *${groupName}*.\n\nWe will *not* miss you. Take your L and leave quietly.`;
          await sock.sendMessage(groupId, {
            image: { url: ppUrl },
            caption: goodbyeText,
            mentions: [participant],
          });
        }
      }
      
    } catch (err) {
      logger.error('❌ Group Handler Error:', err);
    }
  });
};