const { addCommand } = require('../lib');
const store = {};

addCommand(
  {
    pattern: "autorecord ?(on|off)?",
    fromMe: true,
    desc: "Turn on/off auto recording presence",
    category: "settings",
  },
  async (msg, match) => {
    const jid = msg.jid;
    if (!match) {
      return await msg.reply("Usage: .autorecord on | off");
    }
    
    store[jid] = match === "on";
    await msg.reply(`🎙 Auto-recording is now *${match.toUpperCase()}*.`);
  }
);

// Middleware to trigger recording presence if enabled
addCommand(
  {
    on: "message",
  },
  async (msg, _match, bot) => {
    const jid = msg.jid;
    
    // Skip if not in a chat or autorecord is off
    if (!jid || !store[jid]) return;
    
    try {
      await bot.sendPresenceUpdate("recording", jid);
    } catch (e) {
      console.error("Failed to send recording presence:", e);
    }
  }
);