const axios = require("axios");
const { addCommand } = require("../lib");

const API_KEY = "7902cbef76b269e176";
const API_URL = "https://api.nexoracle.com/tts/text-to-speech";
const IMAGE_URL = "https://files.catbox.moe/radonm.jpg";
const CHANNEL_BUTTON = {
  buttonId: "channel",
  buttonText: { displayText: "📢 Join Channel" },
  type: 1,
};

addCommand(
  {
    pattern: "english ?(.*)",
    desc: "Convert English text to speech",
    category: "tools",
    use: ".english <text>",
  },
  async (message, match) => {
    const text = match.trim();

    if (!text) {
      return message.send("*❗ Please provide the text you want to convert to speech.*\n\n_Example:_ `.english Hello, how are you?`");
    }

    const loadingMsg = await message.send("🎙️ Generating voice...");

    try {
      const encodedText = encodeURIComponent(text);
      const url = `${API_URL}?apikey=${API_KEY}&lang=en-US&text=${encodedText}`;
      const { data } = await axios.get(url);

      if (!data || !data.result || !data.result.audio_url) {
        return message.send("❌ Failed to generate speech.");
      }

      await message.send(
        {
          audio: { url: data.result.audio_url },
          mimetype: "audio/mp4",
          ptt: false,
          caption: `🗣️ Text converted to voice (EN-US)\n✅ Powered by 𝗔𝗟𝗣𝗛𝗔-𝗕𝗟𝗔𝗞𝗘 𝗩1`,
          footer: "KERILL TECH™",
          buttons: [CHANNEL_BUTTON],
        },
        { quoted: message }
      );

      await message.send(
        {
          image: { url: IMAGE_URL },
          caption: `🎧 Voice ready!\n📢 Tap below to join our channel.`,
          footer: "ALPHA-BLAKE V1",
          buttons: [CHANNEL_BUTTON],
        },
        { quoted: message }
      );
    } catch (err) {
      console.error("ENGLISH TTS ERROR:", err);
      return message.send("❌ Error converting text to voice.");
    } finally {
      await message.send(loadingMsg.key, { delete: true });
    }
  }
);