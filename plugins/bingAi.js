const axios = require("axios");
const { addCommand } = require("../lib");

const API_KEY = "7902cbef76b269e176";
const API_URL = "https://api.nexoracle.com/ai/bing-ai";
const IMAGE_URL = "https://files.catbox.moe/radonm.jpg";
const CHANNEL_BUTTON = {
  buttonId: "channel",
  buttonText: { displayText: "📢 Join Channel" },
  type: 1,
};

addCommand(
  {
    pattern: "bingai ?(.*)",
    desc: "Ask Bing AI anything",
    category: "ai",
    use: ".bingai <question>",
  },
  async (message, match) => {
    const query = match.trim();

    if (!query) {
      return message.send("*❗ Please enter a question for Bing AI.*\n\n_Example:_ `.bingai What’s the latest tech news?`");
    }

    const loadingMsg = await message.send("🔎 Contacting Bing AI...");

    try {
      const url = `${API_URL}?apikey=${API_KEY}&prompt=${encodeURIComponent(query)}`;
      const { data } = await axios.get(url);
      const reply = data?.result?.response;

      if (!reply) {
        return message.send("❌ No valid response from Bing AI.");
      }

      await message.send(
        {
          text: `🧠 *Bing AI Says:*\n\n${reply}`,
          footer: "Powered by ALPHA-BLAKE V1 🛰️",
          buttons: [CHANNEL_BUTTON],
        },
        { quoted: message }
      );

      await message.send(
        {
          image: { url: IMAGE_URL },
          caption: `✅ Bing AI responded!\n📢 Tap below to join our WhatsApp Channel.`,
          footer: "KERILL TECH™",
          buttons: [CHANNEL_BUTTON],
        },
        { quoted: message }
      );
    } catch (err) {
      console.error("BING AI ERROR:", err);
      return message.send("❌ Something went wrong while talking to Bing AI.");
    } finally {
      await message.send(loadingMsg.key, { delete: true });
    }
  }
);