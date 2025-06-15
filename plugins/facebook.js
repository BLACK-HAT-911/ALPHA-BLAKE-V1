const axios = require("axios");
const { addCommand } = require("../lib");

const API_KEY = "7902cbef76b269e176";
const API_URL = "https://api.nexoracle.com/downloader/facebook";

const IMAGE_URL = "https://files.catbox.moe/radonm.jpg";
const CHANNEL_BUTTON = {
  buttonId: "channel",
  buttonText: { displayText: "📢 Join Channel" },
  type: 1,
};

addCommand(
  {
    pattern: "fb ?(.*)",
    desc: "Download Facebook videos and reels",
    category: "downloader",
    use: ".fb <facebook video/reel url>",
  },
  async (message, match) => {
    const url = match.trim();

    if (!url || !url.includes("facebook.com")) {
      return message.send(
        "*❗ Please provide a valid Facebook video or reel link.*\n\n_Example:_ `.fb https://www.facebook.com/reel/xyz123abc`"
      );
    }

    const loadingMsg = await message.send("⏳ Fetching Facebook video...");

    try {
      const { data } = await axios.get(`${API_URL}?apikey=${API_KEY}&url=${encodeURIComponent(url)}`);

      if (!data || !data.result || !data.result.url) {
        return message.send("❌ Video not found or the link is not public.");
      }

      const videoUrl = data.result.url;
      const quality = data.result.quality || "Standard";

      await message.send(
        {
          video: { url: videoUrl },
          caption:
            `🎬 *Facebook Video Downloaded!*\n\n` +
            `📁 *Quality:* ${quality}\n` +
            `🔗 *Source:* Facebook\n\n` +
            `⚡ Powered by *𝗔𝗟𝗣𝗛𝗔-𝗕𝗟𝗔𝗞𝗘 𝗩1*`,
          footer: "𝗔𝗟𝗣𝗛𝗔-𝗕𝗟𝗔𝗞𝗘 𝗩1",
          buttons: [CHANNEL_BUTTON],
        },
        { quoted: message }
      );

      // Also show thumbnail menu with channel button and image
      await message.send(
        {
          image: { url: IMAGE_URL },
          caption: `✅ *Video sent successfully!*\n\n📢 Stay updated with more tools and features.`,
          footer: "𝗔𝗟𝗣𝗛𝗔-𝗕𝗟𝗔𝗞𝗘 𝗩1",
          buttons: [CHANNEL_BUTTON],
        },
        { quoted: message }
      );
    } catch (err) {
      console.error("Facebook downloader error:", err);
      return message.send("❌ Error: Could not download video. Try again or use a different link.");
    } finally {
      await message.send(loadingMsg.key, { delete: true });
    }
  }
);