const axios = require("axios");
const { addCommand } = require("../lib");
const { fancyMessage } = require("../lib/style"); // Optional helper for menu style

const API_KEY = "7902cbef76b269e176";
const BASE_URL = "https://api.nexoracle.com/downloader/apk";

addCommand(
  {
    pattern: "apk ?(.*)",
    desc: "Download APKs directly from Play Store.",
    category: "downloader",
    use: ".apk <app name>",
  },
  async (message, match) => {
    const query = match || "";
    if (!query) {
      return message.send("*Example:* `.apk Instagram`");
    }

    const loading = await message.send(`🔍 Searching for *${query}*...`);

    try {
      const { data } = await axios.get(`${BASE_URL}?apikey=${API_KEY}&q=${encodeURIComponent(query)}`);

      if (!data || !data.result || !data.result.apk) {
        return message.send("❌ APK not found. Try a different app name.");
      }

      const app = data.result;

      const caption = `🧩 *APK Found!*\n\n` +
                      `📦 *Name:* ${app.name}\n` +
                      `📝 *Version:* ${app.version}\n` +
                      `📁 *Size:* ${app.size}\n` +
                      `📥 *Download:* ${app.apk}`;

      await message.send(
        {
          image: { url: "https://files.catbox.moe/radonm.jpg" },
          caption,
          footer: "𝗔𝗟𝗣𝗛𝗔-𝗕𝗟𝗔𝗞𝗘 𝗩1",
          buttons: [
            {
              buttonId: "channel",
              buttonText: { displayText: "📢 Join Channel" },
              type: 1,
            },
          ],
        },
        { quoted: message }
      );
    } catch (err) {
      console.error(err);
      return message.send("❌ Failed to fetch APK. Try again later.");
    } finally {
      await message.send(loading.key, { delete: true });
    }
  }
);