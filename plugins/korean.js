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
    pattern: "korean ?(.*)",
    desc: "Convert text to Korean voice (ko-KR)",
    category: "tools",
    use: ".korean <text>",
  },
  async (message, match) => {
    const text = match.trim();

    if (!text) {
      return message.send("*❗ Please enter the text to convert into Korean voice.*\n\n_Example:_ `.korean 안녕하세요!`");
    }

    const loadingMsg = await message.send("🇰🇷 Generating Korean voice...");

    try {
      const encodedText = encodeURIComponent(text);
      const url = `${API_URL}?apikey=${API_KEY}&lang=ko-KR&text=${encodedText}`;
      const { data } = await axios.get(url);

      if (!data?.result?.audio_url) {
        return message.send("❌ Failed to generate Korean speech.");
      }

      await message.send(
        {
          audio: { url: data.result.audio_url },
          mimetype: "audio/mp4",
          ptt: false,
          caption: `🇰🇷 Korean TTS Completed\n✅ Powered by 𝗔𝗟𝗣𝗛𝗔-𝗕𝗟𝗔𝗞𝗘 𝗩1`,
          footer: "KERILL TECH™",
          buttons: [CHANNEL_BUTTON],
        },
        { quoted: message }
      );

      await message.send(
        {
          image: { url: IMAGE_URL },
          caption: `✅ Korean voice generated!\n📢 Tap below to join our WhatsApp Channel.`,
          footer: "ALPHA-BLAKE V1 🔥",
          buttons: [CHANNEL_BUTTON],
        },
        { quoted: message }
      );
    } catch (err) {
      console.error("KOREAN TTS ERROR:", err);
      return message.send("❌ Error converting text to Korean voice.");
    } finally {
      await message.send(loadingMsg.key, { delete: true });
    }
  }
);