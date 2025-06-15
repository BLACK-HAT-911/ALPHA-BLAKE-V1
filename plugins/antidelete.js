const { addCommand } = require("../lib");

const antiDelStatus = {}; // groupId => true/false

// Toggle AntiDelete
addCommand(
  {
    pattern: "antidel ?(.*)",
    desc: "Toggle Anti-Delete Messages",
    category: "moderation",
    use: ".antidel on / off",
    fromMe: true,
  },
  async (msg, match) => {
    const input = match.trim().toLowerCase();
    if (!["on", "off"].includes(input)) {
      return msg.send("*🧾 Usage:* `.antidel on` or `.antidel off`");
    }
    
    antiDelStatus[msg.jid] = input === "on";
    await msg.send(`🧷 Anti-Delete has been *${input.toUpperCase()}* in this group.`);
  }
);

// Detect and recover deleted messages
addCommand(
  {
    on: "message_delete",
    fromMe: false,
    desc: "Recover deleted messages",
    category: "moderation",
  },
  async (msg) => {
    const groupId = msg.jid;
    const sender = msg.sender;
    
    if (!msg.isGroup || !antiDelStatus[groupId]) return;
    
    if (!msg.message || !msg.message.key || msg.message.key.fromMe) return;
    
    const original = msg.message.message;
    const quoted = msg.message;
    
    const type = Object.keys(original || {})[0];
    let content = "";
    
    if (type === "conversation") content = original.conversation;
    else if (type === "extendedTextMessage") content = original.extendedTextMessage.text;
    else if (type === "imageMessage" || type === "videoMessage") {
      const media = await msg.bot.downloadAndSaveMediaMessage({ message: original });
      return msg.sendMessage(groupId, {
        [type === "imageMessage" ? "image" : "video"]: media,
        caption: `🕵️ *Deleted media by @${sender.split("@")[0]} recovered!*`,
        mentions: [sender],
      });
    } else {
      return msg.send("*❗ Deleted message type not supported for recovery.*");
    }
    
    if (content) {
      await msg.sendMessage(groupId, {
        text: `💬 *Message deleted by @${sender.split("@")[0]} recovered:*\n\n${content}`,
        mentions: [sender],
      });
    }
  }
);