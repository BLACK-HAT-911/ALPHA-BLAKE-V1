const { addCommand } = require("../lib");

addCommand(
  {
    pattern: "mute",
    desc: "Instantly mute/close the group",
    category: "moderation",
    use: ".mute",
    fromMe: true, // bot owner only
  },
  async (msg) => {
    if (!msg.isGroup) {
      return msg.send("*⚠️ This command only works in groups.*");
    }
    
    try {
      await msg.bot.groupSettingUpdate(msg.jid, "announcement");
      
      await msg.send(
        `🔒 *Group Muted!*\n\nOnly *admins* can send messages now.\n\n_Triggered by:_ @${msg.sender.split("@")[0]}`,
        {
          mentions: [msg.sender],
        }
      );
    } catch (err) {
      await msg.send("*❌ Failed to mute the group. Make sure I'm an admin!*");
    }
  }
);