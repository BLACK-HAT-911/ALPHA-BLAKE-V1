const axios = require("axios");
const { addCommand } = require("../lib");

const API_KEY = "7902cbef76b269e176";
const API_URL = "https://api.nexoracle.com/downloader/media-fire";
const IMAGE_URL = "https://files.catbox.moe/radonm.jpg";

const CHANNEL_BUTTON = {
  buttonId: "channel",
  buttonText: { displayText: "📢 Join Channel" },
  type: 1,
};

addCommand(
  {
    pattern: "mediafire ?(.*)",
    desc: "Download public Mediafire files",
    category: "downloader",
    use: ".mediafire <mediafire link>",
  },
  async (message, match) => {
    const url = match.trim();

    if (!url || !url.includes("mediafire.com")) {
      return message.send(
        "*❗ Please provide a valid Mediafire link.*\n\n_Example:_ `.mediafire https://www.mediafire.com/file/xyz123`"
      );
    }

    const loadingMsg = await message.send("📥 Fetching Mediafire file...");

    try {
      const { data } = await axios.get(`${API_URL}?apikey=${API_KEY}&url=${encodeURIComponent(url)}`);

      if (!data || !data.result || !data.result.download) {
        return message.send("❌ File not found or invalid Mediafire link.");
      }

      const file = data.result;

      await message.send(
        {
          document: { url: file.download },
          fileName: file.filename || "Mediafire_File",
          mimetype: file.mime || "application/octet-stream",
          caption:
            `📁 *File:* ${file.filename}\n` +
            `📦 *Size:* ${file.size || "Unknown"}\n` +
            `🔗 *Link:* Mediafire\n\n` +
            `⚡ Powered by 𝗔𝗟𝗣𝗛𝗔-𝗕𝗟𝗔𝗞𝗘 𝗩1`,
          footer: "𝗔𝗟𝗣𝗛𝗔-𝗕𝗟𝗔𝗞𝗘 𝗩1",
          buttons: [CHANNEL_BUTTON],
        },
        { quoted: message }
      );

      await message.send(
        {
          image: { url: IMAGE_URL },
          caption: `✅ *Mediafire file sent successfully!*\n\n🔔 Find more in our WhatsApp channel.`,
          footer: "𝗔𝗟𝗣𝗛𝗔-𝗕𝗟𝗔𝗞𝗘 𝗩1",
          buttons: [CHANNEL_BUTTON],
        },
        { quoted: message }
      );
    } catch (err) {
      console.error("Mediafire error:", err);
      return message.send("❌ Failed to fetch file. Please check the link.");
    } finally {
      await message.send(loadingMsg.key, { delete: true });
    }
  }
);