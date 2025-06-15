const { addCommand } = require("../lib");

addCommand(
  {
    pattern: "gcname ?(.*)",
    desc: "Change the group subject (name)",
    category: "moderation",
    use: ".gcname New Name",
    fromMe: true, // You can change this to false if you want all admins to use
  },
  async (msg, match) => {
    if (!msg.isGroup) {
      return msg.send("*⚠️ This command only works in group chats.*");
    }
    
    if (!match || match.trim().length < 3) {
      return msg.send("*✍️ Please provide a valid group name (minimum 3 characters).*");
    }
    
    const groupMetadata = await msg.bot.groupMetadata(msg.jid);
    
    const botIsAdmin = groupMetadata.participants.find(
      (p) => p.id === msg.bot.user.id && p.admin
    );
    
    if (!botIsAdmin) {
      return msg.send("*❌ I need admin rights to change the group name.*");
    }
    
    try {
      await msg.bot.groupUpdateSubject(msg.jid, match.trim());
      await msg.send(`✅ *Group name updated to:* ${match.trim()}`);
    } catch (err) {
      console.error("gcname error:", err);
      await msg.send("*❌ Failed to update group name. Make sure I have the right permissions.*");
    }
  }
);