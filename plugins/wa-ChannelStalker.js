const axios = require("axios");
const { addCommand } = require("../lib");

const API_KEY = "7902cbef76b269e176";
const BASE_URL = "https://api.nexoracle.com/stalking/whatsapp-channel";
const IMAGE_URL = "https://files.catbox.moe/radonm.jpg";
const CHANNEL_BUTTON = {
  buttonId: "channel",
  buttonText: { displayText: "📢 Join Channel" },
  type: 1,
};

addCommand(
  {
    pattern: "wachannel ?(.*)",
    desc: "Get information about a WhatsApp channel",
    category: "stalking",
    use: ".wachannel <whatsapp_channel_url>",
  },
  async (message, match) => {
    const url = match.trim();

    if (!url || !url.includes("whatsapp.com/channel")) {
      return message.send("*📱 Please provide a valid WhatsApp Channel URL!*\n\n_Example:_ `.wachannel https://whatsapp.com/channel/0029VbAxoHNF6sn7hhz2Ss24`");
    }

    const loadingMsg = await message.send("🔎 Stalking WhatsApp channel...");

    try {
      const { data } = await axios.get(`${BASE_URL}?apikey=${API_KEY}&url=${encodeURIComponent(url)}`);
      const channel = data?.result;

      if (!channel?.name) {
        return message.send("❌ Channel data not found.");
      }

      const details = `📢 *WhatsApp Channel Info:*

🔹 *Name:* ${channel.name}
🆔 *ID:* ${channel.id}
📝 *Description:* ${channel.description || "N/A"}
👥 *Followers:* ${channel.followers}
🌐 *Link:* ${channel.url}
📸 *Profile Pic:* ${channel.picture}`;

      await message.send(
        {
          text: details,
          footer: "ALPHA-BLAKE V1 • WhatsApp Channel Stalker",
          buttons: [CHANNEL_BUTTON],
        },
        { quoted: message }
      );

      await message.send(
        {
          image: { url: IMAGE_URL },
          caption: `✅ Channel lookup complete!\n📢 Tap below to join our WhatsApp Channel.`,
          footer: "KERILL TECH™",
          buttons: [CHANNEL_BUTTON],
        },
        { quoted: message }
      );
    } catch (err) {
      console.error("WA CHANNEL STALK ERROR:", err);
      return message.send("❌ Error fetching WhatsApp channel info.");
    } finally {
      await message.send(loadingMsg.key, { delete: true });
    }
  }
);