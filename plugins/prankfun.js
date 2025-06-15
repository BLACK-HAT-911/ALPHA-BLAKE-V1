const { addCommand, sleep } = require("../lib");

addCommand(
  {
    pattern: "hack ?(.*)",
    desc: "Fake hacking animation with progress bar and effects",
    category: "fun",
    use: ".hack @target or name",
    fromMe: false,
  },
  async (msg, match) => {
    const target = match || (msg.mention.length ? `@${msg.mention[0].split("@")[0]}` : "unknown device");
    
    await msg.reply(`🔍 Initializing hacking tool...\nTarget: *${target}*`);
    await sleep(1500);
    await msg.reply("🛜 Establishing secure connection...");
    await sleep(1000);
    await msg.reply("🧠 Bypassing multi-layer firewall & encryption...");
    await sleep(1300);
    
    const progressBar = [
      "[░░░░░░░░░░] 0%",
      "[█░░░░░░░░░] 10%",
      "[██░░░░░░░░] 20%",
      "[███░░░░░░░] 30%",
      "[████░░░░░░] 40%",
      "[█████░░░░░] 50%",
      "[██████░░░░] 60%",
      "[███████░░░] 70%",
      "[████████░░] 80%",
      "[█████████░] 90%",
      "[██████████] 100%",
    ];
    
    const progressMsg = await msg.reply("📡 Hacking progress...\n\n" + progressBar[0]);
    
    for (let i = 1; i < progressBar.length; i++) {
      await sleep(700);
      await msg.bot.sendMessage(msg.jid, { text: `📡 Hacking progress...\n\n${progressBar[i]}`, edit: progressMsg.key });
    }
    
    await sleep(1000);
    await msg.reply(`✅ Access granted to ${target}!\n\n📁 Extracting files:\n- Photos\n- Videos\n- Contacts\n- Chats\n- Location Data`);
    await sleep(1200);
    await msg.reply("🔐 Installing spyware...");
    await sleep(1000);
    await msg.reply("💣 Injecting malware...");
    await sleep(1000);
    await msg.reply("📶 Establishing remote control...");
    await sleep(1200);
    await msg.reply("🛰 Sending data to dark web server: http://0xdeadbeef.dark\n\n☣️ Tracking activated.");
    await sleep(1800);
    
    await msg.reply(`😈 ${target} has been *fully compromised*.\n\n💀 *Mission Accomplished.*`);
  }
);