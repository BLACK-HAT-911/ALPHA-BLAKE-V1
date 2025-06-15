const { addCommand } = require("../lib");

addCommand(
  {
    pattern: "gclink",
    desc: "Get the group invite link",
    category: "moderation",
    use: ".gclink",
    fromMe: false,
  },
  async (msg) => {
    if (!msg.isGroup) {
      return msg.send("*⚠️ This command only works in group chats.*");
    }
    
    const metadata = await msg.bot.groupMetadata(msg.jid);
    const botParticipant = metadata.participants.find(
      (p) => p.id === msg.bot.user.id
    );
    
    if (!botParticipant?.admin) {
      return msg.send("*❌ I must be an admin to fetch the group invite link.*");
    }
    
    try {
      const code = await msg.bot.groupInviteCode(msg.jid);
      const groupLink = `https://chat.whatsapp.com/${code}`;
      await msg.send(`🔗 *Group Invite Link:*\n${groupLink}`);
    } catch (err) {
      console.error("gclink.js error:", err);
      await msg.send("*❌ Failed to generate group link. Try again later.*");
    }
  }
);