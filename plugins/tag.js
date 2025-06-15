const { addCommand } = require("../lib");

addCommand(
  {
    pattern: "tag ?(.*)",
    desc: "Tag all group members",
    category: "moderation",
    use: ".tag [your message]",
    fromMe: true,
  },
  async (msg, match) => {
    if (!msg.isGroup) return msg.send("*⚠️ This command works only in group chats.*");
    
    const metadata = await msg.bot.groupMetadata(msg.jid);
    const isBotAdmin = metadata.participants.find(p => p.id === msg.bot.user.id)?.admin;
    if (!isBotAdmin) return msg.send("*❌ I must be an admin to tag everyone.*");
    
    const mentions = metadata.participants.map((p) => p.id);
    const mentionText = match || "📢 *Attention Everyone!*";
    
    let tagText = `🗣️ ${mentionText}\n\n`;
    tagText += metadata.participants
      .map((p, i) => `➤ @${p.id.split("@")[0]}`)
      .join("\n");
    
    await msg.send(tagText, {
      mentions,
    });
  }
);