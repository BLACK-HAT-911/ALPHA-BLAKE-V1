const { addCommand } = require("../lib");

addCommand(
  {
    pattern: "demote",
    desc: "Demote a user from admin",
    category: "moderation",
    use: ".demote (reply to admin)",
    fromMe: true,
  },
  async (msg) => {
    if (!msg.isGroup) return msg.send("*⚠️ Only works in groups.*");
    
    const metadata = await msg.bot.groupMetadata(msg.jid);
    const isBotAdmin = metadata.participants.find(p => p.id === msg.bot.user.id)?.admin;
    
    if (!isBotAdmin) return msg.send("*❌ I need admin rights to demote users.*");
    
    const target = msg.quoted?.sender;
    if (!target) return msg.send("*👤 Reply to the admin you want to demote.*");
    
    try {
      await msg.bot.groupParticipantsUpdate(msg.jid, [target], "demote");
      await msg.send(`❎ @${target.split("@")[0]} has been *demoted from admin.*`, {
        mentions: [target],
      });
    } catch (e) {
      console.error("demote error:", e);
      msg.send("*❌ Failed to demote user.*");
    }
  }
);