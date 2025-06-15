const { addCommand } = require("../lib");

addCommand(
  {
    pattern: "resetlink",
    desc: "Reset and get a new group invite link",
    category: "moderation",
    use: ".resetlink",
    fromMe: true, // Bot owner only
  },
  async (msg) => {
    if (!msg.isGroup) {
      return msg.send("*⚠️ This command only works in group chats.*");
    }
    
    try {
      // Reset the group invite code
      const newCode = await msg.bot.groupRevokeInvite(msg.jid);
      
      // Send new invite link
      await msg.send(
        `🔁 *Group Link Reset Successfully!*\n\n🔗 New Link:\nhttps://chat.whatsapp.com/${newCode}\n\n_Triggered by:_ @${msg.sender.split("@")[0]}`,
        {
          mentions: [msg.sender],
        }
      );
    } catch (err) {
      await msg.send("*❌ Failed to reset the group link. Make sure I'm an admin!*");
    }
  }
);