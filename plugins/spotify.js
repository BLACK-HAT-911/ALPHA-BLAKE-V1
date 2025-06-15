const axios = require("axios");
const { addCommand } = require("../lib");

const API_KEY = "7902cbef76b269e176";
const API_URL = "https://api.nexoracle.com/downloader/spotify";
const IMAGE_URL = "https://files.catbox.moe/radonm.jpg";

const CHANNEL_BUTTON = {
  buttonId: "channel",
  buttonText: { displayText: "📢 Join Channel" },
  type: 1,
};

addCommand(
  {
    pattern: "spotify ?(.*)",
    desc: "Download tracks from Spotify",
    category: "downloader",
    use: ".spotify <spotify track link>",
  },
  async (message, match) => {
    const url = match.trim();

    if (!url || !url.includes("spotify.com/track")) {
      return message.send(
        "*❗ Please provide a valid Spotify track link.*\n\n_Example:_ `.spotify https://open.spotify.com/track/xyz123abc`"
      );
    }

    const loadingMsg = await message.send("🎧 Fetching Spotify track...");

    try {
      const { data } = await axios.get(`${API_URL}?apikey=${API_KEY}&url=${encodeURIComponent(url)}`);

      if (!data || !data.result || !data.result.download_url) {
        return message.send("❌ Track not found or invalid link.");
      }

      const track = data.result;

      await message.send(
        {
          document: { url: track.download_url },
          mimetype: "audio/mpeg",
          fileName: `${track.title || "Spotify_Track"}.mp3`,
          caption:
            `🎵 *Title:* ${track.title || "Unknown"}\n` +
            `🎤 *Artist:* ${track.artist || "Unknown"}\n` +
            `💽 *Album:* ${track.album || "Unknown"}\n\n` +
            `⚡ Powered by 𝗔𝗟𝗣𝗛𝗔-𝗕𝗟𝗔𝗞𝗘 𝗩1`,
          footer: "𝗔𝗟𝗣𝗛𝗔-𝗕𝗟𝗔𝗞𝗘 𝗩1",
          buttons: [CHANNEL_BUTTON],
        },
        { quoted: message }
      );

      await message.send(
        {
          image: { url: IMAGE_URL },
          caption: `✅ *Spotify track sent successfully!*\n\n🔔 Follow our WhatsApp channel for more bots & features.`,
          footer: "𝗔𝗟𝗣𝗛𝗔-𝗕𝗟𝗔𝗞𝗘 𝗩1",
          buttons: [CHANNEL_BUTTON],
        },
        { quoted: message }
      );
    } catch (err) {
      console.error("Spotify downloader error:", err);
      return message.send("❌ Failed to download the track. Try again or check the link.");
    } finally {
      await message.send(loadingMsg.key, { delete: true });
    }
  }
);