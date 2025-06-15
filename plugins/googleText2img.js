const axios = require("axios");
const { addCommand } = require("../lib");

const API_KEY = "7902cbef76b269e176";
const API_URL = "https://api.nexoracle.com/ai/google-text2img";
const IMAGE_URL = "https://files.catbox.moe/radonm.jpg";
const CHANNEL_BUTTON = {
  buttonId: "channel",
  buttonText: { displayText: "📢 Join Channel" },
  type: 1,
};

addCommand(
  {
    pattern: "gimg ?(.*)",
    desc: "Generate images from text using Google AI",
    category: "ai",
    use: ".gimg <prompt>|<model (optional)>",
  },
  async (message, match) => {
    const input = match.trim();

    if (!input) {
      return message.send("*❗ Please provide a prompt.*\n\n_Example:_ `.gimg a cyberpunk robot cat|imagen`");
    }

    const [prompt, model] = input.split("|").map(x => x?.trim());
    const loadingMsg = await message.send("🖼️ Generating image with Google AI...");

    try {
      const url = `${API_URL}?apikey=${API_KEY}&prompt=${encodeURIComponent(prompt)}${model ? `&model=${model}` : ""}`;
      const { data } = await axios.get(url);

      const imageUrl = data?.result?.image;
      if (!imageUrl) {
        return message.send("❌ No image was returned from the API.");
      }

      await message.send(
        {
          image: { url: imageUrl },
          caption: `🎨 *Google AI Generated:*\n\n📝 Prompt: ${prompt}\n📷 Model: ${model || "default"}`,
          footer: "ALPHA-BLAKE V1 • AI Art",
          buttons: [CHANNEL_BUTTON],
        },
        { quoted: message }
      );

      await message.send(
        {
          image: { url: IMAGE_URL },
          caption: `✅ Image generated successfully!\n📢 Tap the button below to join our WhatsApp Channel.`,
          footer: "KERILL TECH™",
          buttons: [CHANNEL_BUTTON],
        },
        { quoted: message }
      );
    } catch (err) {
      console.error("GOOGLE TEXT2IMG ERROR:", err);
      return message.send("❌ Error while generating image from Google AI.");
    } finally {
      await message.send(loadingMsg.key, { delete: true });
    }
  }
);