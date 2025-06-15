const { addCommand } = require("../lib");

addCommand(
  {
    pattern: "delete",
    desc: "Delete a replied message",
    category: "moderation",
    use: ".delete (reply to a message)",
    fromMe: true, // only bot owner can use; change to false to allow everyone
  },
  async (msg) => {
    if (!msg.quoted) {
      return msg.send("*⚠️ Please reply to the message you want to delete.*");
    }
    
    try {
      await msg.bot.sendMessage(msg.chat, {
        delete: {
          remoteJid: msg.chat,
          fromMe: false,
          id: msg.quoted.id,
          participant: msg.quoted.sender,
        },
      });
    } catch (err) {
      await msg.send("*❌ Failed to delete the message.*");
    }
  }
);