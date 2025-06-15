const { isWelcomeEnabled } = require('./lib/database');

bot.ev.on('group-participants.update', async (update) => {
  const { id, participants, action } = update;
  if (action !== 'add') return;

  const enabled = await isWelcomeEnabled(id);
  if (!enabled) return;

  for (const user of participants) {
    const tag = `@${user.split('@')[0]}`;
    const caption = `
🎉 *Welcome ${tag}!*

You just joined the most 🔥 chaotic, savage, and legendary group ever made.

🤖 Meet *ALPHA-BLAKE V1*, your new favorite bot. Type *.menu* to see the magic.

💀 Don't be weird. Don't be lame. Or we’ll cook you like last week’s drama.

👑 Now impress us... or prepare to be roasted. 😈
`;

    await bot.sendMessage(id, {
      image: { url: imageUrl },
      caption,
      mentions: [user],
      buttons: [
        {
          buttonId: 'menu',
          buttonText: { displayText: '📜 Show Menu' },
          type: 1,
        },
        {
          buttonId: 'channel',
          buttonText: { displayText: '📢 WhatsApp Channel' },
          type: 1,
        },
      ],
    });
  }
});