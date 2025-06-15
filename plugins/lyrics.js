const axios = require("axios");
const { addCommand } = require("../lib");

const API_KEY = "7902cbef76b269e176";
const API_URL = "https://api.nexoracle.com/search/lyrics";
const IMAGE_URL = "https://files.catbox.moe/radonm.jpg";
const CHANNEL_BUTTON = {
  buttonId: "channel",
  buttonText: { displayText: "📢 Join Channel" },
  type: 1,
};

addCommand(
  {
    pattern: "lyrics ?(.*)",
    desc: "Search song lyrics by artist or title",
    category: "music",
    use: ".lyrics <song/artist>",
  },
  async (message, match) => {
    const query = match.trim();

    if (!query) {
      return message.send("*🎵 Enter a song title or artist name!*\n\n_Example:_ `.lyrics 2Pac All Eyez On Me`");
    }

    const loadingMsg = await message.send("🎧 Searching lyrics...");

    try {
      const url = `${API_URL}?apikey=${API_KEY}&q=${encodeURIComponent(query)}`;
      const { data } = await axios.get(url);

      const result = data?.result;
      if (!result || !result.lyrics) {
        return message.send("❌ Lyrics not found. Try a different song or spelling.");
      }

      const output = `🎤 *Lyrics Result:*\n\n📌 *Title:* ${result.title || "N/A"}\n👤 *Artist:* ${result.artist || "N/A"}\n\n${result.lyrics}`;

      await message.send(
        {
          text: output.length > 4000 ? output.slice(0, 4000) + "\n\n📄 (Lyrics truncated)" : output,
          footer: "ALPHA-BLAKE V1 • Lyrics Finder",
          buttons: [CHANNEL_BUTTON],
        },
        { quoted: message }
      );

      await message.send(
        {
          image: { url: IMAGE_URL },
          caption: `✅ Lyrics retrieved successfully!\n📢 Join our WhatsApp Channel below.`,
          footer: "KERILL TECH™",
          buttons: [CHANNEL_BUTTON],
        },
        { quoted: message }
      );
    } catch (err) {
      console.error("LYRICS FETCH ERROR:", err);
      return message.send("❌ Error fetching lyrics. Please try again later.");
    } finally {
      await message.send(loadingMsg.key, { delete: true });
    }
  }
);