const { addCommand, isPrivate, setPrivate } = require('../lib/settings');
const imageUrl = 'https://files.catbox.moe/radonm.jpg';
const channelLink = 'https://whatsapp.com/channel/0029Vb5a5G4IHphKUhO9hx0d';

addCommand(
  {
    pattern: 'private',
    fromMe: true, // OWNER ONLY
    desc: 'Switch bot to private mode (owner only)',
    category: 'owner',
  },
  async (msg) => {
    await setPrivate(true);
    
    await msg.sendFromUrl(
      imageUrl,
      `🔒 *ALPHA-BLAKE-V1 IS NOW IN PRIVATE MODE*\n\n📵 Only the owner can use bot commands.\n🤖 All public access has been temporarily disabled.\n\n_Use_ *public* _to return access to everyone._`,
      [{ text: '🔗 Our Channel', url: channelLink }]
    );
  }
);