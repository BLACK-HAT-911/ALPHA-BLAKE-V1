const { addCommand, isAdmin } = require("../lib");

const antiVVStatus = {}; // groupId: true/false

// Command to toggle Anti-ViewOnce
addCommand(
  {
    pattern: "antivv ?(.*)",
    desc: "Enable or disable Anti View-Once",
    category: "moderation",
    use: ".antivv on / off",
    fromMe: true,
  },
  async (msg, match) => {
    const input = match.trim().toLowerCase();
    if (!["on", "off"].includes(input)) {
      return msg.send("*⚙️ Usage:* `.antivv on` or `.antivv off`");
    }

    antiVVStatus[msg.jid] = input === "on";
    await msg.send(`✅ Anti-ViewOnce has been *${input.toUpperCase()}* in this group.`);
  }
);

// Detect and expose view-once
addCommand(
  {
    on: "view_once",
    fromMe: false,
    desc: "Reveals view-once images or videos",
    category: "moderation",
  },
  async (msg) => {
    const groupId = msg.jid;
    const sender = msg.sender;

    if (!msg.isGroup || !antiVVStatus[groupId]) return;

    const type = msg.mtype;
    if (!["imageMessage", "videoMessage"].includes(type)) return;

    const media = await msg.download();
    if (!media) return;

    const caption = `👀 *Nice try @${sender.split("@")[0]}!*  
Your view-once ${
      type === "imageMessage" ? "photo" : "video"
    } has been *exposed* like a spoiler 💀`;

    await msg.sendMessage(
      msg.jid,
      {
        [type === "imageMessage" ? "image" : "video"]: media,
        caption,
        mentions: [sender],
      },
      { quoted: msg }
    );
  }
);