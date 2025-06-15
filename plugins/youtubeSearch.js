const axios = require("axios");
const { addCommand } = require("../lib");

const API_KEY = "7902cbef76b269e176";
const API_URL = "https://api.nexoracle.com/downloader/yt-search";
const IMAGE_URL = "https://files.catbox.moe/radonm.jpg";
const CHANNEL_BUTTON = {
  buttonId: "channel",
  buttonText: { displayText: "📢 Join Channel" },
  type: 1,
};

addCommand(
  {
    pattern: "ytsearch ?(.*)",
    desc: "Search YouTube and get top results",
    category: "downloader",
    use: ".ytsearch <keyword>",
  },
  async (message, match) => {
    const query = match.trim();

    if (!query) {
      return message.send("*❗ Please provide a search keyword.*\n\n_Example:_ `.ytsearch afrobeats 2024`");
    }

    const loadingMsg = await message.send("🔎 Searching YouTube...");

    try {
      const { data } = await axios.get(`${API_URL}?apikey=${API_KEY}&query=${encodeURIComponent(query)}`);
      if (!data || !data.result || !Array.isArray(data.result)) {
        return message.send("❌ No results found.");
      }

      const results = data.result.slice(0, 5); // Top 5 results

      let text = `🔍 *Top YouTube Results for:* "${query}"\n\n`;

      for (let vid of results) {
        text +=
          `🎬 *Title:* ${vid.title || "N/A"}\n` +
          `📺 *Channel:* ${vid.channel || "N/A"}\n` +
          `⏱️ *Duration:* ${vid.duration || "?"}\n` +
          `🔗 *Link:* ${vid.url || "-"}\n\n`;
      }

      await message.send(
        {
          text,
          footer: "Powered by KERILL TECH™",
          buttons: [CHANNEL_BUTTON],
        },
        { quoted: message }
      );

      await message.send(
        {
          image: { url: IMAGE_URL },
          caption: `✅ Done searching YouTube.\n📢 Tap below to join our channel.`,
          footer: "𝗔𝗟𝗣𝗛𝗔-𝗕𝗟𝗔𝗞𝗘 𝗩1",
          buttons: [CHANNEL_BUTTON],
        },
        { quoted: message }
      );
    } catch (err) {
      console.error("YT SEARCH ERROR:", err);
      return message.send("❌ Error fetching search results.");
    } finally {
      await message.send(loadingMsg.key, { delete: true });
    }
  }
);