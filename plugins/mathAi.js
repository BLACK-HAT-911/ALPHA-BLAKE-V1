const axios = require("axios");
const { addCommand } = require("../lib");

const API_KEY = "7902cbef76b269e176";
const API_URL = "https://api.nexoracle.com/ai/math";
const IMAGE_URL = "https://files.catbox.moe/radonm.jpg";
const CHANNEL_BUTTON = {
  buttonId: "channel",
  buttonText: { displayText: "📢 Join Channel" },
  type: 1,
};

addCommand(
  {
    pattern: "mathai ?(.*)",
    desc: "Solve math equations using AI",
    category: "ai",
    use: ".mathai <equation>",
  },
  async (message, match) => {
    const prompt = match.trim();

    if (!prompt) {
      return message.send("*❗ Please enter a math expression to solve.*\n\n_Example:_ `.mathai 3*(2+4)^2`");
    }

    const loadingMsg = await message.send("📐 Calculating...");

    try {
      const url = `${API_URL}?apikey=${API_KEY}&prompt=${encodeURIComponent(prompt)}`;
      const { data } = await axios.get(url);

      const result = data?.result?.response;
      if (!result) {
        return message.send("❌ The AI could not solve this equation.");
      }

      await message.send(
        {
          text: `🧠 *AI Math Result:*\n\n📝 Expression: ${prompt}\n📊 Answer: ${result}`,
          footer: "Powered by ALPHA-BLAKE V1",
          buttons: [CHANNEL_BUTTON],
        },
        { quoted: message }
      );

      await message.send(
        {
          image: { url: IMAGE_URL },
          caption: `✅ Math solved successfully!\n📢 Tap below to join our official WhatsApp Channel.`,
          footer: "KERILL TECH™",
          buttons: [CHANNEL_BUTTON],
        },
        { quoted: message }
      );
    } catch (err) {
      console.error("MATH AI ERROR:", err);
      return message.send("❌ Error occurred while solving the equation.");
    } finally {
      await message.send(loadingMsg.key, { delete: true });
    }
  }
);