const { addCommand } = require("../lib");

addCommand(
  {
    pattern: "tagall ?(.*)",
    desc: "Mention all group members (usable by anyone)",
    category: "moderation",
    use: ".tagall [optional message]",
    fromMe: false, // ✅ allows all users to use the command
  },
  async (msg, match) => {
    if (!msg.isGroup) return msg.send("*⚠️ This command works only in group chats.*");
    
    const metadata = await msg.bot.groupMetadata(msg.jid);
    const participants = metadata.participants;
    const mentions = participants.map(p => p.id);
    const text = match || "🚨 *TAGGING EVERYONE!*";
    
    const list = participants
      .map(p => `▪️ @${p.id.split("@")[0]}`)
      .join("\n");
    
    await msg.send(`${text}\n\n${list}`, {
      mentions,
    });
  }
);