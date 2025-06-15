const { addCommand } = require('../lib/');
const imageUrl = 'https://files.catbox.moe/radonm.jpg';
const channelLink = 'https://whatsapp.com/channel/0029Vb5a5G4IHphKUhO9hx0d';

addCommand(
  {
    pattern: 'speedy',
    desc: 'Check bot response time',
    type: 'info',
    react: '⚡',
  },
  async (msg, text, { client }) => {
    const start = Date.now();
    const loadingMsg = await msg.reply('⚡ Speed test in progress...');
    
    const latency = Date.now() - start;
    const message = `*⚙️ SPEED CHECK COMPLETE!*\n\n*📡 Response Time:* \`${latency}ms\`\n*📍Status:* ${
      latency < 400 ? '🚀 Fast' : latency < 800 ? '⚠️ Moderate' : '🐢 Slow'
    }\n\n🧠 ALPHA-BLAKE-V1 stays sharp.`;
    
    await loadingMsg.delete();
    
    await msg.sendFromUrl(
      imageUrl,
      message,
      [{ text: '🔥 Official Channel', url: channelLink }]
    );
  }
);