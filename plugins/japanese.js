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
    pattern: "japanese ?(.*)",
    desc: "Convert text to Japanese speech (ja-JP)",
    category: "tools",
    use: ".japanese <text>",
  },
  async (message, match) => {
    const text = match.trim();

    if (!text) {
      return message.send("*❗ Please provide the text to convert into Japanese speech.*\n\n_Example:_ `.japanese こんにちは、元気ですか？`");
    }

    const loadingMsg = await message.send("🈶 Generating Japanese voice...");

    try {
      const encodedText = encodeURIComponent(text);
      const url = `${API_URL}?apikey=${API_KEY}&lang=ja-JP&text=${encodedText}`;
      const { data } = await axios.get(url);

      if (!data?.result?.audio_url) {
        return message.send("❌ Failed to generate Japanese speech.");
      }

      await message.send(
        {
          audio: { url: data.result.audio_url },
          mimetype: "audio/mp4",
          ptt: false,
          caption: `🈯 Japanese TTS Complete\n✅ Powered by 𝗔𝗟𝗣𝗛𝗔-𝗕𝗟𝗔𝗞𝗘 𝗩1`,
          footer: "KERILL TECH™",
          buttons: [CHANNEL_BUTTON],
        },
        { quoted: message }
      );

      await message.send(
        {
          image: { url: IMAGE_URL },
          caption: `✅ Voice generated!\n📢 Join our WhatsApp Channel below.`,
          footer: "ALPHA-BLAKE V1 🔥",
          buttons: [CHANNEL_BUTTON],
        },
        { quoted: message }
      );
    } catch (err) {
      console.error("JAPANESE TTS ERROR:", err);
      return message.send("❌ Error converting text to Japanese speech.");
    } finally {
      await message.send(loadingMsg.key, { delete: true });
    }
  }
);