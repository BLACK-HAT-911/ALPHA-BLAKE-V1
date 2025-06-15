const axios = require("axios");
const { addCommand } = require("../lib");

const API_KEY = "7902cbef76b269e176";
const API_URL = "https://api.nexoracle.com/tts/mr-beast";
const IMAGE_URL = "https://files.catbox.moe/radonm.jpg";
const CHANNEL_BUTTON = {
  buttonId: "channel",
  buttonText: { displayText: "📢 Join Channel" },
  type: 1,
};

addCommand(
  {
    pattern: "mrbeast ?(.*)",
    desc: "Text to speech using MrBeast's AI voice",
    category: "tools",
    use: ".mrbeast <text>",
  },
  async (message, match) => {
    const text = match.trim();

    if (!text) {
      return message.send("*❗ Please provide text for MrBeast to say.*\n\n_Example:_ `.mrbeast I just gave away $10,000!`");
    }

    const loadingMsg = await message.send("🗣️ Generating MrBeast's voice...");

    try {
      const response = await axios.get(`${API_URL}?apikey=${API_KEY}&text=${encodeURIComponent(text)}`);
      const audioUrl = response?.data?.result?.audio_url;

      if (!audioUrl) {
        return message.send("❌ Failed to generate MrBeast's voice.");
      }

      await message.send(
        {
          audio: { url: audioUrl },
          mimetype: "audio/mp4",
          ptt: false,
          caption: `🎤 MrBeast AI Voice\n✅ Powered by 𝗔𝗟𝗣𝗛𝗔-𝗕𝗟𝗔𝗞𝗘 𝗩1`,
          footer: "KERILL TECH™",
          buttons: [CHANNEL_BUTTON],
        },
        { quoted: message }
      );

      await message.send(
        {
          image: { url: IMAGE_URL },
          caption: `✅ MrBeast has spoken!\n📢 Join our WhatsApp Channel below.`,
          footer: "ALPHA-BLAKE V1 🔥",
          buttons: [CHANNEL_BUTTON],
        },
        { quoted: message }
      );
    } catch (err) {
      console.error("MRBEAST TTS ERROR:", err);
      return message.send("❌ Error generating MrBeast's voice.");
    } finally {
      await message.send(loadingMsg.key, { delete: true });
    }
  }
);