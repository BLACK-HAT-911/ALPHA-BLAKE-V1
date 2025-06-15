const { addCommand } = require('../lib');
const fs = require('fs');
const path = require('path');

const imageUrl = 'https://files.catbox.moe/radonm.jpg';
const channelLink = 'https://whatsapp.com/channel/0029Vb5a5G4IHphKUhO9hx0d';

const restartFile = path.join(__dirname, '../.restart.json');

addCommand(
  {
    pattern: 'restart',
    fromMe: true,
    desc: 'Restart the bot',
    category: 'core',
  },
  async (msg, match, m, client) => {
    // Save chat and user for post-restart message
    const restartData = {
      chatId: msg.chat,
      senderId: msg.sender,
      timestamp: Date.now()
    };
    
    fs.writeFileSync(restartFile, JSON.stringify(restartData));
    
    await msg.sendFromUrl(
      imageUrl,
      `🔄 *Restarting ALPHA-BLAKE-V1...*\n\n⚙️ Please give me a moment...`,
      [{ text: "📢 My Channel", url: channelLink }]
    );
    
    process.exit(0); // Restarts the bot if under PM2 or similar
  }
);

// Auto-run on startup to send follow-up message
async function postRestartNotify(client) {
  if (fs.existsSync(restartFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(restartFile, 'utf8'));
      const timeAgo = Math.floor((Date.now() - data.timestamp) / 1000);
      
      await client.sendMessage(data.chatId, {
        text: `✅ *ALPHA-BLAKE-V1 is back online!*\n⏱️ Restart completed in ${timeAgo}s`,
      });
      
      fs.unlinkSync(restartFile); // Cleanup after notifying
    } catch (err) {
      console.error("Failed to send post-restart message:", err);
    }
  }
}

module.exports = { postRestartNotify };