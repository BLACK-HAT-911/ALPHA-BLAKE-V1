const { addCommand } = require("../lib");

addCommand(
  {
    pattern: "listadmin",
    desc: "Displays a detailed list of all admins in the group",
    category: "moderation",
    use: ".listadmin",
    fromMe: false,
  },
  async (msg) => {
    if (!msg.isGroup) {
      return msg.send("*⚠️ This command only works in group chats.*");
    }
    
    try {
      const metadata = await msg.bot.groupMetadata(msg.jid);
      const participants = metadata.participants;
      
      const admins = participants.filter((p) => p.admin !== null);
      const owner = participants.find((p) => p.admin === "superadmin" || p.admin === "admin" && metadata.owner === p.id);
      
      const mentions = admins.map((a) => a.id);
      
      let caption = `👥 *Group:* ${metadata.subject}\n🧮 *Members:* ${participants.length}\n\n👑 *Admins List:*\n\n`;
      
      admins.forEach((admin, index) => {
        const username = `@${admin.id.split("@")[0]}`;
        const badge = owner && admin.id === owner.id ? "👑 Owner" : "👮 Admin";
        caption += `*${index + 1}.* ${username} - ${badge}\n`;
      });
      
      await msg.send(caption.trim(), {
        mentions,
      });
      
    } catch (err) {
      console.error("Listadmin error:", err);
      await msg.send("*❌ Failed to fetch admin list. Make sure I'm an admin in the group.*");
    }
  }
);