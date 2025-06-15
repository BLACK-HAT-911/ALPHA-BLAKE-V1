const { addCommand } = require('../lib');
const imageUrl = 'https://files.catbox.moe/radonm.jpg';
const channelLink = 'https://whatsapp.com/channel/0029Vb5a5G4IHphKUhO9hx0d';

addCommand(
  {
    pattern: 'leavegc',
    fromMe: true, // Only the bot owner can use this
    desc: 'Leave the current group',
    category: 'group',
  },
  async (msg, match, m, client) => {
    if (!msg.isGroup) {
      return await msg.reply('❌ This command can only be used in groups.');
    }
    
    await msg.sendFromUrl(
      imageUrl,
      `👋 *ALPHA-BLAKE-V1 is leaving this group...*\n\nIt was nice being here!`,
      [{ text: "📢 My Channel", url: channelLink }]
    );
    
    await client.groupLeave(msg.chat);
  }
);