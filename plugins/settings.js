const { addCommand } = require('../lib/');
const {
  toggleSetting,
  getAllSettings,
  isOwner,
} = require('../lib/database');

const imageUrl = 'https://files.catbox.moe/radonm.jpg';
const channelLink = 'https://whatsapp.com/channel/0029Vb5a5G4IHphKUhO9hx0d';

const validSettings = [
  'autoreact',
  'autorecord',
  'autotyping',
  'antiviewonce',
  'antilink',
  'anti-mention',
  'welcome',
  'goodbye',
  'private',
];

addCommand(
  {
    pattern: 'settings ?(.*)?',
    desc: 'Toggle bot settings (owner only)',
    fromMe: true,
    category: 'owner',
    react: '🛠️',
  },
  async (msg, match) => {
    if (!isOwner(msg.sender)) return await msg.reply('❌ Only the owner can modify settings.');
    
    const args = match.trim().split(' ');
    const setting = args[0]?.toLowerCase();
    const state = args[1]?.toLowerCase();
    
    if (!setting) {
      const settings = await getAllSettings();
      let statusMsg = '*⚙️ Current Bot Settings:*\n\n';
      
      for (const key of validSettings) {
        const isEnabled = settings[key] ? '✅' : '❌';
        statusMsg += `• *${key}*: ${isEnabled}\n`;
      }
      
      return await msg.sendFromUrl(
        imageUrl,
        `${statusMsg}\nUse: *.settings <feature> on/off* to change.`,
        [{ text: '📢 Join Channel', url: channelLink }]
      );
    }
    
    if (!validSettings.includes(setting)) {
      return await msg.reply(
        `❌ Invalid setting!\n\nValid settings: ${validSettings.join(', ')}`
      );
    }
    
    if (!['on', 'off'].includes(state)) {
      return await msg.reply('❌ Please specify *on* or *off*.\nExample: *.settings autoreact on*');
    }
    
    const newValue = state === 'on';
    await toggleSetting(setting, newValue);
    
    return await msg.sendFromUrl(
      imageUrl,
      `✅ Setting updated!\n\n*${setting}* has been turned *${state.toUpperCase()}*.`,
      [{ text: '🔧 ALPHA-BLAKE Panel', url: channelLink }]
    );
  }
);