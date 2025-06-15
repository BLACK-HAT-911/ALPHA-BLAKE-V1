const { exec } = require('child_process');
const { addCommand } = require('../lib/');
const imageUrl = 'https://files.catbox.moe/radonm.jpg';
const channelLink = 'https://whatsapp.com/channel/0029Vb5a5G4IHphKUhO9hx0d';

addCommand(
  {
    pattern: 'update',
    fromMe: true,
    desc: 'Pulls the latest updates from the repo',
    type: 'owner',
    react: '🔄',
  },
  async (msg) => {
    await msg.sendFromUrl(
      imageUrl,
      '*🛰️ Checking for updates...*',
      [{ text: '📢 Join Channel', url: channelLink }]
    );
    
    exec('git pull', async (err, stdout, stderr) => {
      if (err) {
        return await msg.sendFromUrl(
          imageUrl,
          `❌ *Update failed!*\n\n\`\`\`${stderr.trim()}\`\`\``,
          [{ text: '🚑 Report Issue', url: channelLink }]
        );
      }
      
      if (stdout.includes('Already up to date')) {
        return await msg.sendFromUrl(
          imageUrl,
          '✅ *You already have the latest version of ALPHA-BLAKE-V1!*',
          [{ text: '🚀 View Channel', url: channelLink }]
        );
      }
      
      await msg.sendFromUrl(
        imageUrl,
        `✅ *Bot successfully updated!*\n\n\`\`\`${stdout.trim()}\`\`\``,
        [{ text: '✨ Subscribe Channel', url: channelLink }]
      );
    });
  }
);