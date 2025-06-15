const { addCommand } = require('../lib');
const typingStatus = {};

// Command to enable/disable autotyping
addCommand(
  {
    pattern: "autotyping ?(on|off)?",
    fromMe: true,
    desc: "Enable/disable auto typing presence",
    category: "settings",
  },
  async (msg, match) => {
    const jid = msg.jid;
    
    if (!match) {
      return await msg.reply("Usage: `.autotyping on` or `.autotyping off`");
    }
    
    typingStatus[jid] = match === "on";
    await msg.reply(`⌨️ Auto-typing is now *${match.toUpperCase()}*`);
  }
);

// Middleware to trigger typing presence
addCommand(
  {
    on: "message",
  },
  async (msg, _match, bot) => {
    const jid = msg.jid;
    if (!jid || !typingStatus[jid]) return;
    
    try {
      await bot.sendPresenceUpdate("composing", jid);
    } catch (err) {
      console.error("Typing status error:", err);
    }
  }
);