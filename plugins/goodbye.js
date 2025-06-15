const { addCommand } = require('../lib/');
const { setGoodbye, isGoodbyeEnabled } = require('../lib/database');
const imageUrl = 'https://files.catbox.moe/radonm.jpg';
const channelLink = 'https://whatsapp.com/channel/0029Vb5a5G4IHphKUhO9hx0d';

addCommand(
  {
    pattern: 'goodbye ?(on|off)?',
    desc: 'Enable or disable savage goodbye messages for group',
    react: '🪦',
    fromMe: false,
    category: 'group',
  },
  async (msg, match) => {
    if (!msg.isGroup) return await msg.reply('❌ This command is only for groups.');
    if (!msg.isAdmin) return await msg.reply('🚫 Only group admins can toggle this feature.');
    
    if (!match) {
      const status = await isGoodbyeEnabled(msg.chat);
      return await msg.sendFromUrl(
        imageUrl,
        `👋 *Goodbye Settings*\n\n🛠 Status: *${status ? 'ENABLED' : 'DISABLED'}*\n\nType *goodbye on* or *goodbye off* to control the savage exits.`,
        [{ text: '📢 Join Our Channel', url: channelLink }]
      );
    }
    
    const toggle = match.toLowerCase() === 'on';
    await setGoodbye(msg.chat, toggle);
    
    await msg.sendFromUrl(
      imageUrl,
      `✅ *Goodbye messages ${toggle ? 'ENABLED' : 'DISABLED'}!*\n\nNow members will ${toggle ? '*leave with style (and shame)*' : '*slip away silently*'}.`,
      [{ text: '🔥 Our WhatsApp Channel', url: channelLink }]
    );
  }
);