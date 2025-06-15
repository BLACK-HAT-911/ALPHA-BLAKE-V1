const { addCommand, formatDate } = require("../lib");

addCommand(
  {
    pattern: "groupinfo",
    desc: "Shows detailed information about the group",
    category: "moderation",
    use: ".groupinfo",
    fromMe: false,
  },
  async (msg) => {
    if (!msg.isGroup) {
      return msg.send("*⚠️ This command only works in group chats.*");
    }
    
    try {
      const metadata = await msg.bot.groupMetadata(msg.jid);
      const { subject, id, creation, owner, desc, participants } = metadata;
      
      const groupOwner = owner ? `@${owner.split("@")[0]}` : "*Unavailable*";
      const adminList = participants.filter((p) => p.admin !== null);
      const adminCount = adminList.length;
      const memberCount = participants.length;
      const groupDesc = desc?.desc || "No description set.";
      
      const creationDate = creation ?
        new Date(creation * 1000).toLocaleString() :
        "Unknown";
      
      const message = `
🏷️ *Group Name:* ${subject}
🆔 *Group ID:* ${id}
📅 *Created:* ${creationDate}
👑 *Owner:* ${groupOwner}
👥 *Members:* ${memberCount}
🔧 *Admins:* ${adminCount}
📝 *Description:* ${groupDesc}
      `.trim();
      
      await msg.send(message, {
        mentions: [owner, ...adminList.map((a) => a.id)],
      });
      
    } catch (err) {
      console.error("groupinfo error:", err);
      await msg.send("*❌ Failed to fetch group info.*");
    }
  }
);