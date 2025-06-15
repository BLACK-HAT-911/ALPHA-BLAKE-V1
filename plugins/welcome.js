const { addCommand } = require('../lib/');
const { isWelcomeEnabled, setWelcome } = require('../lib/database');
const imageUrl = 'https://files.catbox.moe/radonm.jpg';
const channelLink = 'https://whatsapp.com/channel/0029Vb5a5G4IHphKUhO9hx0d';

addCommand(
  {
    pattern: 'welcome ?(on|off)?',
    desc: 'Enable or disable welcome messages for group',
    react: '🎉',
    fromMe: false,
    category: 'group',
  },
  async (msg, match) => {
    if (!msg.isGroup) return await msg.reply('❌ This command only works in groups.');
    if (!msg.isAdmin) return await msg.reply('🚫 Only admins can toggle welcome messages.');
    
    if (!match) {
      const status = await isWelcomeEnabled(msg.chat);
      return await msg.sendFromUrl(
        imageUrl,
        `🙌 *Welcome Settings*\n\n📢 Status: *${status ? 'ENABLED' : 'DISABLED'}*\n\nUse *welcome on* or *welcome off* to control greetings.`,
        [{ text: '💬 Join Our Channel', url: channelLink }]
      );
    }
    
    const toggle = match.toLowerCase() === 'on';
    await setWelcome(msg.chat, toggle);
    
    await msg.sendFromUrl(
      imageUrl,
      `✅ *Welcome messages ${toggle ? 'ENABLED' : 'DISABLED'}!*\n\nEvery new member will now be greeted like royalty... or roasted like lunch. 🔥`,
      [{ text: '📢 ALPHA-BLAKE Channel', url: channelLink }]
    );
  }
);