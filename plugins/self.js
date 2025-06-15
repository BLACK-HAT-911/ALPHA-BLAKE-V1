const { addCommand, setSelfMode } = require('../lib/settings');
const imageUrl = 'https://files.catbox.moe/radonm.jpg';
const channelLink = 'https://whatsapp.com/channel/0029Vb5a5G4IHphKUhO9hx0d';

addCommand(
  {
    pattern: 'self',
    fromMe: true,
    desc: 'Activate self mode (ignore everyone except owner)',
    category: 'owner',
  },
  async (msg) => {
    await setSelfMode(true);
    await msg.sendFromUrl(
      imageUrl,
      `🙈 *SELF MODE ACTIVATED!*\n\n🤖 Bot will now *ignore everyone* except the owner.\n\n_Use_ *public* _to make it respond to everyone again._`,
      [{ text: '📢 WhatsApp Channel', url: channelLink }]
    );
  }
);