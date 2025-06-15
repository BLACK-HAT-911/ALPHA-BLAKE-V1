const axios = require("axios");
const { addCommand } = require("../lib");

const API_KEY = "7902cbef76b269e176";
const BASE_URL = "https://api.nexoracle.com/stalking/ip";
const IMAGE_URL = "https://files.catbox.moe/radonm.jpg";
const CHANNEL_BUTTON = {
  buttonId: "channel",
  buttonText: { displayText: "📢 Join Channel" },
  type: 1,
};

addCommand(
  {
    pattern: "ipstalk ?(.*)",
    desc: "Get detailed info about any IP address",
    category: "search",
    use: ".ipstalk <IP_ADDRESS>",
  },
  async (message, match) => {
    const ip = match.trim();

    if (!ip || !/^\d{1,3}(\.\d{1,3}){3}$/.test(ip)) {
      return message.send("*🌍 Please provide a valid IPv4 address!*\n\n_Example:_ `.ipstalk 66.249.66.207`");
    }

    const loadingMsg = await message.send("🔎 Stalking IP address...");

    try {
      const { data } = await axios.get(`${BASE_URL}?apikey=${API_KEY}&q=${ip}`);
      const info = data?.result;

      if (!info || !info.query) {
        return message.send("❌ No data found for this IP.");
      }

      const ipInfo = `📡 *IP Address Info:*

🔹 *IP:* ${info.query}
🌍 *Country:* ${info.country} (${info.countryCode})
🏙️ *Region:* ${info.regionName}
🌆 *City:* ${info.city}
📮 *ZIP:* ${info.zip}
🕐 *Timezone:* ${info.timezone}
📶 *ISP:* ${info.isp}
🏢 *Organization:* ${info.org}
🔗 *AS:* ${info.as}`;

      await message.send(
        {
          text: ipInfo,
          footer: "ALPHA-BLAKE V1 • IP Tracker",
          buttons: [CHANNEL_BUTTON],
        },
        { quoted: message }
      );

      await message.send(
        {
          image: { url: IMAGE_URL },
          caption: `✅ IP lookup complete!\n📢 Tap below to join our WhatsApp Channel.`,
          footer: "KERILL TECH™",
          buttons: [CHANNEL_BUTTON],
        },
        { quoted: message }
      );
    } catch (err) {
      console.error("IP STALK ERROR:", err);
      return message.send("❌ Error fetching IP details. Try again.");
    } finally {
      await message.send(loadingMsg.key, { delete: true });
    }
  }
);