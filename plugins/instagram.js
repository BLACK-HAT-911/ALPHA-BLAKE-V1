const axios = require("axios");
const { addCommand } = require("../lib");

const API_KEY = "7902cbef76b269e176";
const API_URL = "https://api.nexoracle.com/downloader/insta";
const IMAGE_URL = "https://files.catbox.moe/radonm.jpg";

const CHANNEL_BUTTON = {
  buttonId: "channel",
  buttonText: { displayText: "📢 Join Channel" },
  type: 1,
};

addCommand(
  {
    pattern: "insta ?(.*)",
    desc: "Download Instagram posts, reels, videos, photos",
    category: "downloader",
    use: ".insta <instagram link>",
  },
  async (message, match) => {
    const url = match.trim();

    if (!url || !url.includes("instagram.com")) {
      return message.send(
        "*❗ Please provide a valid Instagram link.*\n\n_Example:_ `.insta https://www.instagram.com/reel/abc123xyz/`"
      );
    }

    const loadingMsg = await message.send("📥 Downloading from Instagram...");

    try {
      const { data } = await axios.get(`${API_URL}?apikey=${API_KEY}&url=${encodeURIComponent(url)}`);

      if (!data || !data.result || data.result.length === 0) {
        return message.send("❌ Media not found. Make sure the post is public.");
      }

      const mediaList = data.result;

      for (const media of mediaList) {
        if (media.type === "video") {
          await message.send(
            {
              video: { url: media.url },
              caption: `🎞️ *Instagram Video*\n\n📡 Powered by 𝗔𝗟𝗣𝗛𝗔-𝗕𝗟𝗔𝗞𝗘 𝗩1`,
              footer: "𝗔𝗟𝗣𝗛𝗔-𝗕𝗟𝗔𝗞𝗘 𝗩1",
              buttons: [CHANNEL_BUTTON],
            },
            { quoted: message }
          );
        } else if (media.type === "image") {
          await message.send(
            {
              image: { url: media.url },
              caption: `🖼️ *Instagram Photo*\n\n📡 Powered by 𝗔𝗟𝗣𝗛𝗔-𝗕𝗟𝗔𝗞𝗘 𝗩1`,
              footer: "𝗔𝗟𝗣𝗛𝗔-𝗕𝗟𝗔𝗞𝗘 𝗩1",
              buttons: [CHANNEL_BUTTON],
            },
            { quoted: message }
          );
        }
      }

      // Show standard template image + join channel
      await message.send(
        {
          image: { url: IMAGE_URL },
          caption: `✅ *Instagram media sent successfully!*\n\n🔔 More tools in our channel.`,
          footer: "𝗔𝗟𝗣𝗛𝗔-𝗕𝗟𝗔𝗞𝗘 𝗩1",
          buttons: [CHANNEL_BUTTON],
        },
        { quoted: message }
      );
    } catch (err) {
      console.error("Instagram downloader error:", err);
      return message.send("❌ Failed to download. Try again or check the link.");
    } finally {
      await message.send(loadingMsg.key, { delete: true });
    }
  }
);