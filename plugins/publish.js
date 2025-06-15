const { addCommand, getGroups, getChats } = require('../lib/');
const imageUrl = 'https://files.catbox.moe/radonm.jpg';
const channelLink = 'https://whatsapp.com/channel/0029Vb5a5G4IHphKUhO9hx0d';

addCommand(
  {
    pattern: 'publish ?(.*)',
    fromMe: true,
    desc: 'Send a message to all groups, chats, and contacts',
    type: 'broadcast',
    react: '📢',
  },
  async (msg, match, m) => {
    const quoted = m.quoted?.text || m.quoted?.caption || '';
    const body = match || quoted || '';
    
    if (!body) return await msg.reply('📝 Send a message or reply to one to publish.');
    
    const groups = await getGroups(msg.user.id);
    const chats = await getChats(msg.user.id);
    
    let count = 0;
    
    for (const chat of [...groups, ...chats]) {
      try {
        await msg.bot.sendFromUrl(
          chat.id,
          imageUrl,
          `📣 *Broadcast from ${msg.pushName || 'Admin'}:*\n\n${body}`,
          [{ text: '📢 Our Channel', url: channelLink }]
        );
        count++;
      } catch (e) {
        console.error(`Failed to send to ${chat.id}:`, e.message);
      }
    }
    
    await msg.reply(`✅ Successfully published to ${count} chats.`);
  }
);