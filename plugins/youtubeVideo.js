const axios = require("axios");
const { addCommand } = require("../lib");

const API_KEY = "7902cbef76b269e176";
const API_URL = "https://api.nexoracle.com/downloader/yt-video";
const IMAGE_URL = "https://files.catbox.moe/radonm.jpg";
const CHANNEL_BUTTON = {
  buttonId: "channel",
  buttonText: { displayText: "📢 Join Channel" },
  type: 1,
};

addCommand(
  {
    pattern: "yt ?(.*)",
    desc: "Download YouTube videos or Shorts",
    category: "downloader",
    use: ".yt <youtube video link>",
  },
  async (message, match) => {
    const url = match.trim();

    if (!url || (!url.includes("youtube.com") && !url.includes("youtu.be"))) {
      return message.send("*❗ Please provide a valid YouTube link.*");
    }

    const loadingMsg = await message.send("📽️ Downloading...");

    try {
      const { data } = await axios.get(`${API_URL}?apikey=${API_KEY}&url=${encodeURIComponent(url)}`);
      if (!data || !data.result || !data.result.download_url) {
        return message.send("❌ Couldn't fetch video. Try another link.");
      }

      const video = data.result;

      await message.send(
        {
          video: { url: video.download_url },
          caption:
            `🎬 *Title:* ${video.title || "Unknown"}\n` +
            `📺 *Channel:* ${video.channel || "N/A"}\n` +
            `⏱️ *Duration:* ${video.duration || "N/A"}\n\n` +
            `✅ Downloaded via 𝗔𝗟𝗣𝗛𝗔-𝗕𝗟𝗔𝗞𝗘 𝗩1`,
          footer: "KERILL TECH™",
          buttons: [CHANNEL_BUTTON],
        },
        { quoted: message }
      );

      await message.send(
        {
          image: { url: IMAGE_URL },
          caption:
            `✅ Video ready.\nFollow us for more tools and updates.`,
          footer: "Channel below 👇",
          buttons: [CHANNEL_BUTTON],
        },
        { quoted: message }
      );
    } catch (err) {
      console.error("YT ERROR:", err);
      return message.send("❌ Error downloading video.");
    } finally {
      await message.send(loadingMsg.key, { delete: true });
    }
  }
);