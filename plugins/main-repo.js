const { addCommand } = require('../lib/');
const imageUrl = 'https://files.catbox.moe/radonm.jpg';
const channelLink = 'https://whatsapp.com/channel/0029Vb5a5G4IHphKUhO9hx0d';

addCommand(
  {
    pattern: 'main-repo',
    fromMe: true,
    desc: 'Displays the main GitHub repository of the bot',
    type: 'owner',
    react: '🧩',
  },
  async (msg) => {
    const message = `🚀 *ALPHA-BLAKE-V1 Official Repository*\n\n📦 GitHub: [Click to View](https://github.com/BLACK-HAT-911/ALPHA-BLAKE-V1)\n\n🛠️ You can clone, fork, or star the repo to follow the latest updates.\n\n*Powering the next-gen WhatsApp automation.* 💡`;
    
    await msg.sendFromUrl(
      imageUrl,
      message,
      [{ text: '📢 Join Our Channel', url: channelLink }]
    );
  }
);