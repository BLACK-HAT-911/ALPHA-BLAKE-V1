const axios = require("axios");
const { addCommand } = require("../lib");

const API_KEY = "7902cbef76b269e176";
const API_URL = "https://api.nexoracle.com/downloader/yt-play2";
const IMAGE_URL = "https://files.catbox.moe/radonm.jpg";
const CHANNEL_BUTTON = {
  buttonId: "channel",
  buttonText: { displayText: "📢 Join Channel" },
  type: 1,
};

addCommand(
  {
    pattern: "play ?(.*)",
    desc: "Search and download a YouTube song as audio",
    category: "downloader",
    use: ".play <song name>",
  },
  async (message, match) => {
    const query = match.trim();

    if (!query) {
      return message.send("*❗ Please enter a song name to search.*\n\n_Example:_ `.play calm down rihanna`");
    }

    const loadingMsg = await message.send("🎧 Searching for your song...");

    try {
      const { data } = await axios.get(`${API_URL}?apikey=${API_KEY}&q=${encodeURIComponent(query)}`);

      if (!data || !data.result || !data.result.audio_url) {
        return message.send("❌ Couldn't find a playable audio track. Try a different name.");
      }

      const result = data.result;

      await message.send(
        {
          audio: { url: result.audio_url },
          mimetype: "audio/mp4",
          ptt: false,
          fileName: result.title ? result.title + ".mp3" : "track.mp3",
          caption:
            `🎵 *Title:* ${result.title || "Unknown"}\n` +
            `📺 *Channel:* ${result.channel || "N/A"}\n` +
            `⏱️ *Duration:* ${result.duration || "N/A"}\n\n` +
            `✅ Powered by 𝗔𝗟𝗣𝗛𝗔-𝗕𝗟𝗔𝗞𝗘 𝗩1`,
          footer: "KERILL TECH™",
          buttons: [CHANNEL_BUTTON],
        },
        { quoted: message }
      );

      await message.send(
        {
          image: { url: IMAGE_URL },
          caption: `✅ Song downloaded.\n📢 Join our channel below for more tools and updates.`,
          footer: "ALPHA-BLAKE V1 🔥",
          buttons: [CHANNEL_BUTTON],
        },
        { quoted: message }
      );
    } catch (err) {
      console.error("YT AUDIO PLAY ERROR:", err);
      return message.send("❌ Failed to download the song.");
    } finally {
      await message.send(loadingMsg.key, { delete: true });
    }
  }
);