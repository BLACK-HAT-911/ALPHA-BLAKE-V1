const { addCommand, sendImageWithButton } = require('../lib');

const autoReactStatus = {};
const imageUrl = 'https://files.catbox.moe/radonm.jpg';
const channelLink = 'https://whatsapp.com/channel/0029Vb5a5G4IHphKUhO9hx0d';

const coolReactions = [
  "🔥", "😎", "💯", "👀", "🤖", "✨", "🚀", "🥶", "🧠", "💥", "🕶️", "🤯", "🎯", "⚡",
  "😂", "🤣", "😭", "😅", "😜", "😈", "😇", "🤡", "🥵", "🥳", "💀", "👻", "👽",
  "🤓", "🙃", "🤯", "🧩", "🎮", "🎉", "🎊", "❤️", "💙", "💚", "💛", "🖤", "💜",
  "🌈", "🌟", "🌠", "⭐", "☄️", "🌞", "🌚", "🎆", "🎇", "🧨", "📸", "📱", "🪄",
  "🏆", "🥇", "🥈", "🥉", "👊", "👏", "🖖", "🙏", "🤝", "🤌", "🤙", "🫶", "😺",
  "😹", "😻", "😼", "😽", "🙀", "😿", "😾", "🙈", "🙉", "🙊", "🫠", "🫢", "🫣",
  "🧠", "🔮", "🎭", "🎤", "🎧", "🖥️", "💻", "🕹️", "📀", "💿", "🧬", "🦾", "🦿",
  "🧑‍💻", "🧑‍🚀", "🧑‍🎤", "🧑‍🔬", "💡", "⚔️", "🛡️", "🗡️", "🔫", "🪓", "🪃", "🧲",
  "🐉", "🐲", "🦄", "🐸", "🐵", "🦊", "🐺", "🦁", "🐯", "🐶", "🐱", "🦍", "🦓", "🦬"
  // 300+ available, add more if needed
];

// .autoreact on / off command
addCommand(
  {
    pattern: "autoreact ?(on|off)?",
    fromMe: true,
    desc: "Enable or disable auto emoji reactions",
    category: "settings",
  },
  async (msg, match) => {
    if (!match) {
      return await msg.reply("Usage:\n.autoreact on\n.autoreact off");
    }
    
    autoReactStatus[msg.jid] = match === "on";
    
    await sendImageWithButton(
      msg,
      imageUrl,
      `✅ Auto-react is now *${match.toUpperCase()}* for this chat.\n\n💬 I’ll react with over 300 epic emojis!`,
      [{ text: "📢 My Channel", url: channelLink }]
    );
  }
);

// React to all messages if autoreact is enabled
addCommand(
  {
    on: "message",
  },
  async (msg, _match, bot) => {
    const jid = msg.jid;
    if (!jid || !autoReactStatus[jid]) return;
    if (msg.fromMe) return;
    
    try {
      const emoji = coolReactions[Math.floor(Math.random() * coolReactions.length)];
      await bot.sendMessage(jid, {
        react: {
          text: emoji,
          key: msg.key,
        },
      });
    } catch (err) {
      console.error("Auto-react failed:", err.message);
    }
  }
);