const { addCommand } = require('../lib/');
const axios = require('axios');
const imageUrl = 'https://files.catbox.moe/radonm.jpg';
const channelLink = 'https://whatsapp.com/channel/0029Vb5a5G4IHphKUhO9hx0d';

addCommand(
  {
    pattern: 'repo-details',
    fromMe: true,
    desc: 'Fetches real-time GitHub repository data',
    type: 'owner',
    react: '🧠',
  },
  async (msg) => {
    try {
      const repoOwner = 'BLACK-HAT-911';
      const repoName = 'ALPHA-BLAKE-V1';
      const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}`;
      
      const { data } = await axios.get(apiUrl);
      
      const details = `📂 *Repository Details (Live)*

🧩 *Name:* ${data.name}
📝 *Description:* ${data.description || 'No description'}
⭐ *Stars:* ${data.stargazers_count}
🍴 *Forks:* ${data.forks_count}
❗ *Open Issues:* ${data.open_issues}
📅 *Last Updated:* ${new Date(data.updated_at).toLocaleString()}

🔗 [View on GitHub](https://github.com/${repoOwner}/${repoName})
`;
      
      await msg.sendFromUrl(
        imageUrl,
        details,
        [{ text: '📢 Our Channel', url: channelLink }]
      );
    } catch (err) {
      await msg.reply('❌ Failed to fetch repository details. GitHub API might be down.');
    }
  }
);