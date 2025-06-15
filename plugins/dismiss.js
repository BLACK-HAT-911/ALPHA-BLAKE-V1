const { addCommand } = require("../lib");

addCommand(
  {
    pattern: "dismiss",
    desc: "Remove a user from the group",
    category: "moderation",
    use: ".dismiss @user OR reply to a user",
    fromMe: true, // Only owner/bot controller
  },
  async (msg) => {
    if (!msg.isGroup) {
      return msg.send("*⚠️ This command only works in group chats.*");
    }
    
    const groupMetadata = await msg.bot.groupMetadata(msg.jid);
    const botIsAdmin = groupMetadata.participants.find(
      (p) => p.id === msg.bot.user.id && p.admin
    );
    
    if (!botIsAdmin) {
      return msg.send("*❌ I need to be an admin to dismiss someone.*");
    }
    
    let targetUser;
    
    // Get target from mention or reply
    if (msg.reply_message) {
      targetUser = msg.reply_message.sender;
    } else if (msg.mentionedJid && msg.mentionedJid.length > 0) {
      targetUser = msg.mentionedJid[0];
    } else {
      return msg.send("*🧠 Tag a user or reply to their message to dismiss them.*");
    }
    
    const isAdmin = groupMetadata.participants.find(
      (p) => p.id === targetUser && p.admin !== null
    );
    
    if (isAdmin) {
      return msg.send("*🚫 I can't dismiss an admin. Try demoting them first.*");
    }
    
    try {
      await msg.bot.groupParticipantsUpdate(msg.jid, [targetUser], "remove");
      await msg.send(`👢 *@${targetUser.split("@")[0]} has been dismissed from the group!*`, {
        mentions: [targetUser],
      });
    } catch (err) {
      console.error("Dismiss error:", err);
      await msg.send("*❌ Failed to dismiss user. Maybe they're already removed or I lack permission.*");
    }
  }
);