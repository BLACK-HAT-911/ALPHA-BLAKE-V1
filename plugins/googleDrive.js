const axios = require("axios");
const { addCommand } = require("../lib");

const API_KEY = "7902cbef76b269e176";
const API_URL = "https://api.nexoracle.com/downloader/gdrive";
const IMAGE_URL = "https://files.catbox.moe/radonm.jpg";

const CHANNEL_BUTTON = {
  buttonId: "channel",
  buttonText: { displayText: "📢 Join Channel" },
  type: 1,
};

addCommand(
  {
    pattern: "gdrive ?(.*)",
    desc: "Download public Google Drive files",
    category: "downloader",
    use: ".gdrive <google drive link>",
  },
  async (message, match) => {
    const url = match.trim();

    if (!url || !url.includes("drive.google.com")) {
      return message.send(
        "*❗ Please provide a valid Google Drive file link.*\n\n_Example:_ `.gdrive https://drive.google.com/file/d/abc123/view`"
      );
    }

    const loadingMsg = await message.send("☁️ Fetching Google Drive file...");

    try {
      const { data } = await axios.get(`${API_URL}?apikey=${API_KEY}&url=${encodeURIComponent(url)}`);

      if (!data || !data.result || !data.result.downloadUrl) {
        return message.send("❌ File not found or inaccessible. Ensure it’s set to public.");
      }

      const file = data.result;

      await message.send(
        {
          document: { url: file.downloadUrl },
          fileName: file.name || "GoogleDrive_File",
          mimetype: file.mimeType || "application/octet-stream",
          caption:
            `📁 *File:* ${file.name}\n` +
            `📦 *Size:* ${file.size || "Unknown"}\n` +
            `🔗 *Type:* ${file.mimeType}\n\n` +
            `⚡ Powered by 𝗔𝗟𝗣𝗛𝗔-𝗕𝗟𝗔𝗞𝗘 𝗩1`,
          footer: "𝗔𝗟𝗣𝗛𝗔-𝗕𝗟𝗔𝗞𝗘 𝗩1",
          buttons: [CHANNEL_BUTTON],
        },
        { quoted: message }
      );

      await message.send(
        {
          image: { url: IMAGE_URL },
          caption: `✅ *Google Drive file sent successfully!*\n\n🔔 Get more tools in our channel.`,
          footer: "𝗔𝗟𝗣𝗛𝗔-𝗕𝗟𝗔𝗞𝗘 𝗩1",
          buttons: [CHANNEL_BUTTON],
        },
        { quoted: message }
      );
    } catch (err) {
      console.error("Google Drive error:", err);
      return message.send("❌ Failed to download file. Check the link or try again.");
    } finally {
      await message.send(loadingMsg.key, { delete: true });
    }
  }
);