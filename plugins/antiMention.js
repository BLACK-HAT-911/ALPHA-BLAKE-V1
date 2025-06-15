const { addCommand } = require("../lib");
const mentionWarn = {};

addCommand(
  {
    pattern: "anti-mention ?(on|off)?",
    fromMe: true,
    desc: "Warns & kicks users who mention numbers in groups",
    category: "moderation",
  },
  async (msg, match) => {
    const gcID = msg.jid;
    if (!msg.isGroup) return await msg.reply("🚫 Group only feature.");

    if (!match) return await msg.reply("Usage: `.anti-mention on` or `.anti-mention off`");

    msg.botConfig = msg.botConfig || {};
    msg.botConfig[gcID] = msg.botConfig[gcID] || {};
    msg.botConfig[gcID].antiMention = match === "on";

    await msg.reply(`🛡 Anti-Mention has been *${match === "on" ? "enabled" : "disabled"}*.`);
  }
);

// Listener
addCommand(
  {
    on: "text",
  },
  async (msg) => {
    const gcID = msg.jid;
    const sender = msg.sender;

    if (!msg.isGroup) return;

    msg.botConfig = msg.botConfig || {};
    const isEnabled = msg.botConfig[gcID]?.antiMention;
    if (!isEnabled) return;

    const mentionRegex = /@[0-9]{10,15}/;
    if (!mentionRegex.test(msg.body)) return;

    mentionWarn[gcID] = mentionWarn[gcID] || {};
    mentionWarn[gcID][sender] = mentionWarn[gcID][sender] || 0;
    mentionWarn[gcID][sender]++;

    const warnCount = mentionWarn[gcID][sender];

    const savageLines = {
      1: `🧼 First warning, @${sender.split("@")[0]}.\nYou're walking around with your brain on airplane mode. Stop flexing your status like we care.`,
      2: `🤡 Second warning, clown.\nYou're not important. Nobody's saving your number, you're not Drake.`,
      3: `💀 Final warning, peasant.\nKeep showing off that ugly @mention and you'll be kicked harder than your dad kicked you out.`,
    };

    if (warnCount >= 4) {
      try {
        await msg.sendMessage(
          `🚪 @${sender.split("@")[0]} just got evicted from the chat like expired milk.\n*Go mention your failure elsewhere.* 👋`,
          { mentions: [sender] }
        );
        await msg.groupParticipantsUpdate(gcID, [sender], "remove");
        mentionWarn[gcID][sender] = 0;
      } catch (err) {
        await msg.reply("❌ Failed to kick. Maybe I'm not admin?");
      }
    } else {
      await msg.sendMessage(savageLines[warnCount], {
        mentions: [sender],
      });
    }
  }
);