const { addCommand, isAdmin, deleteMessage } = require("../lib");

// In-memory DB (per group)
const antiLinkStatus = {}; // { [groupId]: true/false }
const warnings = {};       // { [groupId]: { [userId]: count } }

// Link regex — universal
const linkRegex = /(?:https?:\/\/|www\.|chat\.whatsapp\.com|wa\.me|t\.me|discord\.gg|(?:[a-z0-9-]+\.)+[a-z]{2,})/i;

// Enable/Disable Command
addCommand(
  {
    pattern: "antilink ?(.*)",
    desc: "Toggle Anti-Link",
    category: "moderation",
    use: ".antilink on / off",
    fromMe: true,
  },
  async (msg, match) => {
    const status = match.trim().toLowerCase();
    const groupId = msg.jid;

    if (!["on", "off"].includes(status)) {
      return msg.send("*🧩 Usage:* `.antilink on` or `.antilink off`");
    }

    antiLinkStatus[groupId] = status === "on";
    await msg.send(`✅ Anti-Link has been *${status.toUpperCase()}* in this group.`);
  }
);

// Auto-detect message
addCommand(
  {
    on: "text",
    fromMe: false,
    desc: "Auto-remove link senders",
    category: "moderation",
  },
  async (msg) => {
    const groupId = msg.jid;
    const sender = msg.sender;

    if (!msg.isGroup || !antiLinkStatus[groupId]) return;
    if (!linkRegex.test(msg.body)) return;

    const botIsAdmin = await isAdmin(groupId, msg.user.jid);
    const senderIsAdmin = await isAdmin(groupId, sender);
    if (senderIsAdmin) return;

    // Delete link message
    await deleteMessage(groupId, msg.key);

    // Warning tracking
    warnings[groupId] = warnings[groupId] || {};
    warnings[groupId][sender] = (warnings[groupId][sender] || 0) + 1;
    const count = warnings[groupId][sender];

    if (count >= 3) {
      await msg.send(
        `🚫 @${sender.split("@")[0]} was *removed* for violating the link rules *3 times*!`,
        { mentions: [sender] }
      );
      if (botIsAdmin) {
        await msg.groupParticipantsUpdate(groupId, [sender], "remove");
      }
      delete warnings[groupId][sender];
    } else {
      const warningsLeft = 3 - count;
      const warnMsg = [
        `🚨 *Anti-Link Alert!*`,
        `@${sender.split("@")[0]}, sending links is *not allowed* in this group!`,
        `❌ Your message was deleted.`,
        `🛑 Warning: *${count}/3*`,
        warningsLeft === 1
          ? "⚠️ *Final warning!* One more and you're out."
          : `💡 You have *${warningsLeft}* warnings left.`,
      ].join("\n");

      await msg.send(warnMsg, { mentions: [sender] });
    }
  }
);