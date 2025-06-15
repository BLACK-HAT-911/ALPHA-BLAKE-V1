const { addCommand, sendImageWithButton } = require('../lib');
const os = require('os');

const imageUrl = 'https://files.catbox.moe/radonm.jpg';
const channelLink = 'https://whatsapp.com/channel/0029Vb5a5G4IHphKUhO9hx0d';

function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000) % 60;
  const minutes = Math.floor(ms / (1000 * 60)) % 60;
  const hours = Math.floor(ms / (1000 * 60 * 60));
  return `${hours}h ${minutes}m ${seconds}s`;
}

function getStartTime() {
  const now = new Date();
  const start = new Date(now.getTime() - process.uptime() * 1000);
  return start.toLocaleString();
}

addCommand(
  {
    pattern: "uptime",
    fromMe: false,
    desc: "Shows how long the bot has been active",
    category: "core",
  },
  async (msg) => {
    const uptime = formatDuration(process.uptime() * 1000);
    const since = getStartTime();
    
    await sendImageWithButton(
      msg,
      imageUrl,
      `⚙️ *ALPHA-BLAKE-V1 has been active for:* ${uptime}\n\n🕰️ *Since:* ${since}`,
      [{ text: "📢 My Channel", url: channelLink }]
    );
  }
);