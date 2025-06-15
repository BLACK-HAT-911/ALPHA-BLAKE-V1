const axios = require("axios");
const { addCommand } = require("../lib");

const API_KEY = "7902cbef76b269e176";
const API_URL = "https://api.nexoracle.com/ai/deepseek-coder-6.7b-base";
const IMAGE_URL = "https://files.catbox.moe/radonm.jpg";
const CHANNEL_BUTTON = {
  buttonId: "channel",
  buttonText: { displayText: "📢 Join Channel" },
  type: 1,
};

addCommand(
  {
    pattern: "deepseek ?(.*)",
    desc: "AI Coder - DeepSeek 6.7B",
    category: "ai",
    use: ".deepseek <your coding prompt>",
  },
  async (message, match) => {
    const prompt = match.trim();

    if (!prompt) {
      return message.send("*❗ Provide a prompt for the AI coder.*\n\n_Example:_ `.deepseek Write a function that reverses a string in JavaScript`");
    }

    const loadingMsg = await message.send("💻 Thinking like a coder...");

    try {
      const url = `${API_URL}?apikey=${API_KEY}&prompt=${encodeURIComponent(prompt)}`;
      const { data } = await axios.get(url);

      const reply = data?.result?.response;
      if (!reply) {
        return message.send("❌ DeepSeek AI didn’t respond.");
      }

      await message.send(
        {
          text: `👨‍💻 *DeepSeek AI Says:*\n\n${reply}`,
          footer: "Powered by ALPHA-BLAKE V1 💡",
          buttons: [CHANNEL_BUTTON],
        },
        { quoted: message }
      );

      await message.send(
        {
          image: { url: IMAGE_URL },
          caption: `✅ AI-powered coding response\n📢 Join our channel for more tools.`,
          footer: "KERILL TECH™",
          buttons: [CHANNEL_BUTTON],
        },
        { quoted: message }
      );
    } catch (err) {
      console.error("DEEPSEEK ERROR:", err);
      return message.send("❌ Something went wrong with DeepSeek AI.");
    } finally {
      await message.send(loadingMsg.key, { delete: true });
    }
  }
);