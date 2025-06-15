const { addCommand, isAdmin } = require('../lib');
const config = require('../config');

addCommand(
  {
    pattern: 'alive',
    fromMe: true, // Only owner can use
    desc: 'Show bot status',
    category: 'owner',
  },
  async (msg) => {
    const caption = `*🤖 ALPHA-BLAKE V1 is Alive!*\n\n`
      + `🔹 *Speed:* Lightning fast ⚡\n`
      + `🔹 *Owner:* ${config.ownerName || "JADEN"}\n`
      + `🔹 *Version:* 1.0.0\n`
      + `🔹 *Powered by:* KERILL TECH\n\n`
      + `_Tap the button below to follow the channel for updates_ 👇`;

    const image = { url: "https://files.catbox.moe/radonm.jpg" };

    const button = [
      {
        buttonId: "channel",
        buttonText: { displayText: "📢 Our WhatsApp Channel" },
        type: 1,
        url: "https://whatsapp.com/channel/0029Vb5a5G4IHphKUhO9hx0d"
      },
    ];

    await msg.sendMessage(image, {
      caption,
      buttons: button,
      footer: "🔥 ALPHA-BLAKE SYSTEM",
      headerType: 4,
    });
  }
);