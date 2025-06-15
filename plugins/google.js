const axios = require("axios");
const { addCommand } = require("../lib");

const API_KEY = "7902cbef76b269e176";
const API_URL = "https://api.nexoracle.com/search/google";
const IMAGE_URL = "https://files.catbox.moe/radonm.jpg";
const CHANNEL_BUTTON = {
  buttonId: "channel",
  buttonText: { displayText: "📢 Join Channel" },
  type: 1,
};

addCommand(
  {
    pattern: "google ?(.*)",
    desc: "Search anything using Google",
    category: "search",
    use: ".google <query>",
  },
  async (message, match) => {
    const query = match.trim();

    if (!query) {
      return message.send("*❗ Enter a search query first!*\n\n_Example:_ `.google Who is Maher Zubair`");
    }

    const loadingMsg = await message.send("🌐 Searching Google...");

    try {
      const url = `${API_URL}?apikey=${API_KEY}&q=${encodeURIComponent(query)}`;
      const { data } = await axios.get(url);

      const result = data?.result?.[0];
      if (!result || !result.title) {
        return message.send("❌ No search results found.");
      }

      let text = `🔎 *Google Search Result:*\n\n📌 *Title:* ${result.title}\n🔗 *Link:* ${result.link}\n📄 *Snippet:* ${result.snippet}`;

      await message.send(
        {
          text,
          footer: "ALPHA-BLAKE V1 • Google Search",
          buttons: [CHANNEL_BUTTON],
        },
        { quoted: message }
      );

      await message.send(
        {
          image: { url: IMAGE_URL },
          caption: `✅ Search completed!\n📢 Tap below to join our WhatsApp Channel.`,
          footer: "KERILL TECH™",
          buttons: [CHANNEL_BUTTON],
        },
        { quoted: message }
      );
    } catch (err) {
      console.error("GOOGLE SEARCH ERROR:", err);
      return message.send("❌ Error while fetching search results.");
    } finally {
      await message.send(loadingMsg.key, { delete: true });
    }
  }
);