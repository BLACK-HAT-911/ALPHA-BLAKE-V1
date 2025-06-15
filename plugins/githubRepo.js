const axios = require("axios");
const { addCommand } = require("../lib");

const API_KEY = "7902cbef76b269e176";
const API_URL = "https://api.nexoracle.com/search/github-repo";
const IMAGE_URL = "https://files.catbox.moe/radonm.jpg";
const CHANNEL_BUTTON = {
  buttonId: "channel",
  buttonText: { displayText: "📢 Join Channel" },
  type: 1,
};

addCommand(
  {
    pattern: "repo ?(.*)",
    desc: "Fetch GitHub repository details via NexOracle",
    category: "search",
    use: ".repo <GitHub repo URL>",
  },
  async (message, match) => {
    const input = match.trim();

    if (!input.startsWith("https://github.com/")) {
      return message.send("*❗ Please provide a valid GitHub repository URL.*\n\n_Example:_ `.repo https://github.com/BLACK-HAT-911/ALPHA-BLAKE-V1`");
    }

    const loadingMsg = await message.send("🕵️‍♂️ Fetching GitHub repo info...");

    try {
      const url = `${API_URL}?apikey=${API_KEY}&url=${encodeURIComponent(input)}`;
      const { data } = await axios.get(url);

      const repo = data?.result;
      if (!repo || !repo.repo_name) {
        return message.send("❌ No information found for this repository.");
      }

      const caption = `📦 *GitHub Repository Info*

🔹 *Name:* ${repo.repo_name}
👨‍💻 *Owner:* ${repo.owner}
📄 *Description:* ${repo.description || "No description"}
🧑‍💻 *Language:* ${repo.language || "N/A"}
⭐ *Stars:* ${repo.stars}
🍴 *Forks:* ${repo.forks}
📅 *Last Updated:* ${repo.updated_at}
🔗 *URL:* ${repo.repo_url}`;

      await message.send(
        {
          text: caption,
          footer: "ALPHA-BLAKE V1 • GitHub Lookup",
          buttons: [CHANNEL_BUTTON],
        },
        { quoted: message }
      );

      await message.send(
        {
          image: { url: IMAGE_URL },
          caption: `✅ GitHub info retrieved!\n📢 Tap below to join our WhatsApp Channel.`,
          footer: "KERILL TECH™",
          buttons: [CHANNEL_BUTTON],
        },
        { quoted: message }
      );
    } catch (error) {
      console.error("GITHUB_REPO ERROR:", error);
      return message.send("❌ Failed to fetch GitHub repository data.");
    } finally {
      await message.send(loadingMsg.key, { delete: true });
    }
  }
);