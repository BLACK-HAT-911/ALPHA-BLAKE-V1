const axios = require("axios");
const { addCommand } = require("../lib");

const API_KEY = "7902cbef76b269e176";
const API_URL = "https://api.nexoracle.com/ai/chatgpt-v4";
const IMAGE_URL = "https://files.catbox.moe/radonm.jpg";
const CHANNEL_BUTTON = {
  buttonId: "channel",
  buttonText: { displayText: "📢 Join Channel" },
  type: 1,
};

addCommand(
  {
    pattern: "chatgpt4 ?(.*)",
    desc: "Chat with ChatGPT-4 AI",
    category: "ai",
    use: ".chatgpt4 <your message>",
  },
  async (message, match) => {
    const prompt = match.trim();

    if (!prompt) {
      return message.send("*❗ Please provide a prompt for ChatGPT-4.*\n\n_Example:_ `.chatgpt4 Explain black holes in simple terms`");
    }

    const loadingMsg = await message.send("🧠 Contacting ChatGPT-4...");

    try {
      const url = `${API_URL}?apikey=${API_KEY}&prompt=${encodeURIComponent(prompt)}`;
      const { data } = await axios.get(url);

      const reply = data?.result?.response;
      if (!reply) {
        return message.send("❌ No valid response from ChatGPT-4.");
      }

      await message.send(
        {
          text: `🧠 *ChatGPT-4 Responded:*\n\n${reply}`,
          footer: "Powered by ALPHA-BLAKE V1 🤖",
          buttons: [CHANNEL_BUTTON],
        },
        { quoted: message }
      );

      await message.send(
        {
          image: { url: IMAGE_URL },
          caption: `✅ AI intelligence unlocked!\n📢 Join our WhatsApp Channel below.`,
          footer: "KERILL TECH™",
          buttons: [CHANNEL_BUTTON],
        },
        { quoted: message }
      );
    } catch (err) {
      console.error("CHATGPT-4 ERROR:", err);
      return message.send("❌ Something went wrong while talking to ChatGPT-4.");
    } finally {
      await message.send(loadingMsg.key, { delete: true });
    }
  }
);