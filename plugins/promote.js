const { addCommand } = require("../lib");

addCommand(
  {
    pattern: "promote",
    desc: "Promote a user to admin",
    category: "moderation",
    use: ".promote (reply to user)",
    fromMe: true,
  },
  async (msg) => {
    if (!msg.isGroup) return msg.send("*⚠️ Only works in groups.*");
    
    const metadata = await msg.bot.groupMetadata(msg.jid);
    const isBotAdmin = metadata.participants.find(p => p.id === msg.bot.user.id)?.admin;
    
    if (!isBotAdmin) return msg.send("*❌ I need admin rights to promote users.*");
    
    const target = msg.quoted?.sender;
    if (!target) return msg.send("*👤 Reply to the user you want to promote.*");
    
    try {
      await msg.bot.groupParticipantsUpdate(msg.jid, [target], "promote");
      await msg.send(`✅ @${target.split("@")[0]} has been *promoted to admin*!`, {
        mentions: [target],
      });
    } catch (e) {
      console.error("promote error:", e);
      msg.send("*❌ Failed to promote user.*");
    }
  }
);