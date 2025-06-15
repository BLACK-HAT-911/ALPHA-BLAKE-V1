const axios = require("axios");
const { addCommand } = require("../lib");

const API_KEY = "7902cbef76b269e176";
const API_URL = "https://api.nexoracle.com/ai/blackbox";
const IMAGE_URL = "https://files.catbox.moe/radonm.jpg";
const CHANNEL_BUTTON = {
  buttonId: "channel",
  buttonText: { displayText: "📢 Join Channel" },
  type: 1,
};

addCommand(
  {
    pattern: "blackbox ?(.*)",
    desc: "Talk to AI (BlackBox)",
    category: "ai",
    use: ".blackbox <your question>",
  },
  async (message, match) => {
    const prompt = match.trim();

    if (!prompt) {
      return message.send("*❗ Please provide a prompt to ask BlackBox AI.*\n\n_Example:_ `.blackbox How do I make a website?`");
    }

    const loadingMsg = await message.send("🤖 Thinking...");

    try {
      const url = `${API_URL}?apikey=${API_KEY}&prompt=${encodeURIComponent(prompt)}`;
      const { data } = await axios.get(url);

      const reply = data?.result?.response;
      if (!reply) {
        return message.send("❌ AI didn’t return a valid response.");
      }

      await message.send(
        {
          text: `💬 *BlackBox AI Response:*\n\n${reply}`,
          footer: "Powered by ALPHA-BLAKE V1 🤖",
          buttons: [CHANNEL_BUTTON],
        },
        { quoted: message }
      );

      await message.send(
        {
          image: { url: IMAGE_URL },
          caption: `✅ AI is here to help!\n📢 Join our WhatsApp Channel below.`,
          footer: "KERILL TECH™",
          buttons: [CHANNEL_BUTTON],
        },
        { quoted: message }
      );
    } catch (err) {
      console.error("BLACKBOX AI ERROR:", err);
      return message.send("❌ Something went wrong while talking to the AI.");
    } finally {
      await message.send(loadingMsg.key, { delete: true });
    }
  }
);