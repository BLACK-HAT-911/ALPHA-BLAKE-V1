const axios = require("axios");
const { addCommand } = require("../lib");

const API_KEY = "7902cbef76b269e176";
const BASE_URL = "https://api.nexoracle.com/stalking/github-user";
const IMAGE_URL = "https://files.catbox.moe/radonm.jpg";
const CHANNEL_BUTTON = {
  buttonId: "channel",
  buttonText: { displayText: "📢 Join Channel" },
  type: 1,
};

addCommand(
  {
    pattern: "ghstalk ?(.*)",
    desc: "Get info about a GitHub user",
    category: "search",
    use: ".ghstalk <github_username>",
  },
  async (message, match) => {
    const username = match.trim();

    if (!username) {
      return message.send("*❗ Provide a GitHub username!*\n\n_Example:_ `.ghstalk BLACK-HAT-911`");
    }

    const loadingMsg = await message.send("🔍 Stalking GitHub user...");

    try {
      const { data } = await axios.get(`${BASE_URL}?apikey=${API_KEY}&user=${username}`);
      const user = data?.result;

      if (!user || !user.username) {
        return message.send("❌ GitHub user not found.");
      }

      const profile = `🧑‍💻 *GitHub User Info:*

👤 *Username:* ${user.username}
📝 *Bio:* ${user.bio || "N/A"}
🌐 *Blog:* ${user.blog || "N/A"}
🏙️ *Location:* ${user.location || "N/A"}
📅 *Joined:* ${user.joined}
📁 *Repos:* ${user.repos}
👥 *Followers:* ${user.followers}
👣 *Following:* ${user.following}
⭐ *Public Gists:* ${user.gists}
🔗 *Profile:* ${user.url}
`;

      await message.send(
        {
          text: profile,
          footer: "ALPHA-BLAKE V1 • GitHub Stalker",
          buttons: [CHANNEL_BUTTON],
        },
        { quoted: message }
      );

      await message.send(
        {
          image: { url: IMAGE_URL },
          caption: `✅ GitHub user data loaded.\n📢 Tap below to join our WhatsApp Channel.`,
          footer: "KERILL TECH™",
          buttons: [CHANNEL_BUTTON],
        },
        { quoted: message }
      );
    } catch (err) {
      console.error("GITHUB STALK ERROR:", err);
      return message.send("❌ Failed to retrieve GitHub user data.");
    } finally {
      await message.send(loadingMsg.key, { delete: true });
    }
  }
);