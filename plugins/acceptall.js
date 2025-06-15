const { addCommand } = require("../lib");

addCommand(
  {
    pattern: "acceptall",
    desc: "Accept all pending group join requests",
    category: "moderation",
    use: ".acceptall",
    fromMe: true, // Only for bot owner/admin
  },
  async (msg) => {
    if (!msg.isGroup) {
      return msg.send("*⚠️ This command only works in group chats.*");
    }
    
    try {
      const res = await msg.bot.groupRequestParticipantsList(msg.jid);
      
      if (!res || res.length === 0) {
        return msg.send("*✅ No pending requests found.*");
      }
      
      await msg.bot.groupRequestParticipantsUpdate(
        msg.jid,
        res.map((u) => u.jid),
        "approve"
      );
      
      return msg.send(
        `✅ *Accepted all pending join requests!*\n👥 Total: ${res.length}\n\n_Triggered by:_ @${msg.sender.split("@")[0]}`,
        {
          mentions: [msg.sender],
        }
      );
    } catch (err) {
      return msg.send("*❌ Failed to accept join requests. Ensure I'm an admin & group has requests pending.*");
    }
  }
);