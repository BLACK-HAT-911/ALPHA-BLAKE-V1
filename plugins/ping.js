const { addCommand } = require('../lib');
const imageUrl = 'https://files.catbox.moe/radonm.jpg';
const channelLink = 'https://whatsapp.com/channel/0029Vb5a5G4IHphKUhO9hx0d';

addCommand(
  {
    pattern: 'ping',
    fromMe: false,
    desc: 'Measures ALPHA-BLAKE-V1 speed & responsiveness',
    category: 'utility',
  },
  async (msg) => {
    const start = Date.now();
    const temp = await msg.reply('⚡ Activating speed test... Hold tight!');
    const ping = Date.now() - start;
    
    await msg.sendFromUrl(
      imageUrl,
      `🧠 *ALPHA-BLAKE-V1 STATUS REPORT*\n\n` +
      `🔋 *Latency:* \`${ping}ms\`\n` +
      `🚀 *Bot Engine:* Fully Operational\n` +
      `🧬 *Neural Sync:* ✅ Synced\n\n` +
      `💬 _"Built different. Responds faster than your thoughts."_`,
      [{ text: "🌐 Join Our Channel", url: channelLink }]
    );
    
    await temp.delete(); // Cleanup the temp pinging message
  }
);