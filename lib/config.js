require('dotenv').config();

module.exports = {
  // 💬 Bot Identity
  botName: 'ALPHA-BLAKE-V1',
  botVersion: '1.0.0',
  botImage: 'https://files.catbox.moe/radonm.jpg',
  botFooter: 'ALPHA-BLAKE-V1 | ⚡ Powered by JADEN',
  botChannelLink: 'https://whatsapp.com/channel/0029Vb5a5G4IHphKUhO9hx0d',
  
  // 👑 Owner Details
  ownerName: 'JADEN',
  ownerNumber: ['254712345678'], // include country code
  isOwner: (jid) => ['254712345678@s.whatsapp.net'].includes(jid),
  
  // 🔐 API Keys (place yours in .env)
  openaiKey: process.env.OPENAI_API_KEY || 'your-openai-api-key',
  blackboxKey: process.env.BLACKBOX_API_KEY || '',
  deepseekKey: process.env.DEEPSEEK_API_KEY || '',
  mathAiKey: process.env.MATHAI_API_KEY || '',
  
  // 🔧 Feature Flags
  autoreact: true,
  autotyping: true,
  autorecord: true,
  antiDelete: true,
  antiViewOnce: true,
  antiLink: true,
  antiMention: true,
  privateMode: false, // set true for private-only bot usage
  selfMode: false, // true = bot replies to only itself
  
  // ⚙️ Advanced Settings
  commandPrefix: '.',
  sessionName: 'session', // Baileys auth directory
  msgCooldown: 1, // seconds between messages
  maxAIChars: 4000, // limit output length from AI
  
  // 📦 Deployment Info
  repo: 'https://github.com/Jaden-Afrix/ALPHA-BLAKE-V1',
  supportChannel: 'https://whatsapp.com/channel/0029Vb5a5G4IHphKUhO9hx0d',
  supportGroup: 'https://chat.whatsapp.com/your-support-group',
  
  // 🧠 Emoji Pool (for autoreact.js)
  emojiPool: [
    '🔥', '🤖', '💀', '🥶', '😈', '👑', '⚡', '🧠', '🫠', '🧊', '🚀', '🌪️', '🐉', '🦂', '🐺', '🐾',
    '🥷', '🦾', '🕶️', '🎯', '💣', '🧨', '🔫', '🔮', '🪄', '🧬', '💡', '📡', '👽', '📱', '🔌', '⚙️',
    '🤝', '🧍‍♂️', '🗿', '🧛', '🧟', '🪑', '🛸', '🔊', '🎮', '🎵', '🎤', '🎧', '📸', '📽️', '💾',
    // extend up to 300+...
  ]
};