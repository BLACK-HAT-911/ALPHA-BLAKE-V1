const { addCommand } = require("../lib");

addCommand(
  {
    pattern: "unmute",
    desc: "Unmute/open the group so everyone can chat",
    category: "moderation",
    use: ".unmute",
    fromMe: true, // Only bot owner/admin
  },
  async (msg) => {
    if (!msg.isGroup) {
      return msg.send("*⚠️ This command only works in group chats.*");
    }
    
    try {
      await msg.bot.groupSettingUpdate(msg.jid, "not_announcement");
      
      await msg.send(
        `🔓 *Group Unmuted!*\n\nEveryone can now send messages.\n\n_Triggered by:_ @${msg.sender.split("@")[0]}`,
        {
          mentions: [msg.sender],
        }
      );
    } catch (err) {
      await msg.send("*❌ Failed to unmute the group. Make sure I'm an admin!*");
    }
  }
);