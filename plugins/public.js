addCommand(
  {
    pattern: 'public',
    fromMe: true,
    desc: 'Switch bot to public mode (everyone can use)',
    category: 'owner',
  },
  async (msg) => {
    await setPrivate(false);
    
    await msg.sendFromUrl(
      imageUrl,
      `✅ *ALPHA-BLAKE-V1 IS NOW IN PUBLIC MODE*\n\n🌍 Everyone can use bot commands again.\n🔓 Access has been unlocked by the owner.`,
      [{ text: '💬 Our Channel', url: channelLink }]
    );
  }
);