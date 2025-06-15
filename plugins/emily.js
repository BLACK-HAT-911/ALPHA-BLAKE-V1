const axios = require("axios");
const { addCommand } = require("../lib");

const API_KEY = "7902cbef76b269e176";
const API_URL = "https://api.nexoracle.com/tts/emily";
const IMAGE_URL = "https://files.catbox.moe/radonm.jpg";
const CHANNEL_BUTTON = {
  buttonId: "channel",
  buttonText: { displayText: "📢 Join Channel" },
  type: 1,
};

addCommand(
  {
    pattern: "emily ?(.*)",
    desc: "Text to speech using the Emily AI voice",
    category: "tools",
    use: ".emily <text>",
  },
  async (message, match) => {
    const text = match.trim();

    if (!text) {
      return message.send("*❗ Please enter the text to convert to Emily's voice.*\n\n_Example:_ `.emily Hey, welcome to ALPHA-BLAKE!`");
    }

    const loadingMsg = await message.send("🎤 Generating Emily's voice...");

    try {
      const response = await axios.get(`${API_URL}?apikey=${API_KEY}&text=${encodeURIComponent(text)}`);
      const audioUrl = response?.data?.result?.audio_url;

      if (!audioUrl) {
        return message.send("❌ Failed to generate voice using Emily.");
      }

      await message.send(
        {
          audio: { url: audioUrl },
          mimetype: "audio/mp4",
          ptt: false,
          caption: `🎙️ Voice generated with Emily AI\n✅ Powered by 𝗔𝗟𝗣𝗛𝗔-𝗕𝗟𝗔𝗞𝗘 𝗩1`,
          footer: "KERILL TECH™",
          buttons: [CHANNEL_BUTTON],
        },
        { quoted: message }
      );

      await message.send(
        {
          image: { url: IMAGE_URL },
          caption: `✅ Emily has spoken!\n📢 Join our WhatsApp Channel below.`,
          footer: "ALPHA-BLAKE V1 🔥",
          buttons: [CHANNEL_BUTTON],
        },
        { quoted: message }
      );
    } catch (err) {
      console.error("EMILY TTS ERROR:", err);
      return message.send("❌ Error generating Emily's voice.");
    } finally {
      await message.send(loadingMsg.key, { delete: true });
    }
  }
);