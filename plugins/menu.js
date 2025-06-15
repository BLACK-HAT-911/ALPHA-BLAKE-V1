const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

module.exports = (sock) => {
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.fromMe || !msg.message.conversation) return;

        const text = msg.message.conversation.toLowerCase().trim();
        const command = ['menu', 'help', 'menu1'].includes(text) ? text : null;
        if (!command) return;

        const menuText = `
╭━━━━⊱ 𝗔𝗟𝗣𝗛𝗔-𝗕𝗟𝗔𝗞𝗘⊰━━━╮
│        
│ 🔮 *𝗔𝗜 & 𝗖𝗛𝗔𝗧 𝗧𝗢𝗢𝗟𝗦*
│ ┠・.chatgpt4
│ ┠・.bingai
│ ┠・.blackbox
│ ┠・.deepseek
│ ┠・.mathai
│ ┠・.googletext2img
│ ┠・.google
│ ┠・.lyrics
│ ┠・.githubrepo
│ ┠・.githubstalk
│ ┠・.ipstalker
│ ┠・.wachannel
│ 
│ 🔊 *𝗧𝗘𝗫𝗧-𝗧𝗢-𝗦𝗣𝗘𝗘𝗖𝗛*
│ ┠・.english
│ ┠・.japanese
│ ┠・.korean
│ ┠・.emily
│ ┠・.mrbeast
│ 
│ 📥 *𝗠𝗘𝗗𝗜𝗔 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥𝗦*
│ ┠・.ytvideo
│ ┠・.ytplay
│ ┠・.ytsearch
│ ┠・.insta
│ ┠・.facebook
│ ┠・.spotify
│ ┠・.gdrive
│ ┠・.mediafire
│ ┠・.dlapk
│ 
│ 🛡️ *𝗔𝗡𝗧𝗜 𝗙𝗘𝗔𝗧𝗨𝗥𝗘𝗦*
│ ┠・.antilink (auto warn)
│ ┠・.antivv (mock view once)
│ ┠・.antidel (track deleted)
│ ┠・.antimention (warn with insults)
│ 
│ ⚙️ *𝗚𝗥𝗢𝗨𝗣 𝗠𝗢𝗗𝗘𝗥𝗔𝗧𝗜𝗢𝗡*
│ ┠・.acceptall
│ ┠・.dismiss <@tag>
│ ┠・.promote <@tag>
│ ┠・.demote <@tag>
│ ┠・.listadmin
│ ┠・.gcname
│ ┠・.groupinfo
│ ┠・.gclink
│ ┠・.tag
│ ┠・.tagall
│ ┠・.mute
│ ┠・.unmute
│ ┠・.resetlink
│ ┠・.leavegc
│ ┠・.goodbye
│ ┠・.welcome
│ 
│ 🎭 *𝗣𝗥𝗔𝗡𝗞𝗦 & 𝗙𝗨𝗡*
│ ┠・.hack
│ ┠・.toxic
│ 
│ ⚡ *𝗕𝗢𝗧 𝗖𝗢𝗡𝗧𝗥𝗢𝗟*
│ ┠・.settings
│ ┠・.upgrade
│ ┠・.restart
│ ┠・.speedy
│ ┠・.uptime
│ ┠・.private
│ ┠・.self
│ ┠・.autoreact
│ ┠・.autotyping
│ ┠・.autorecord
│ ┠・.ping
│ ┠・.publish
│ 
│ 👑 *𝗢𝗪𝗡𝗘𝗥 𝗠𝗘𝗡𝗨*
│ ┠・.alive
│ ┠・.update
│ ┠・.mainrepo
│ ┠・.repodetails
│ ┠・.alphablakev1
│ 
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
✨ *𝗣𝗼𝘄𝗲𝗿𝗲𝗱 𝗯𝘆 𝗝𝗔𝗗𝗘𝗡* • 𝗔𝗟𝗣𝗛𝗔-𝗕𝗟𝗔𝗞𝗘-𝗩𝟭
`.trim();

        await sock.sendMessage(
            msg.key.remoteJid,
            {
                image: { url: 'https://files.catbox.moe/radonm.jpg' },
                caption: menuText,
                footer: '© 2025 JADEN TECHNOLOGIES',
                buttons: [
                    {
                        buttonId: 'channel',
                        buttonText: { displayText: '📢 𝗢𝗙𝗙𝗜𝗖𝗜𝗔𝗟 𝗖𝗛𝗔𝗡𝗡𝗘𝗟' },
                        type: 1
                    },
                    {
                        buttonId: 'support',
                        buttonText: { displayText: '🛡️ 𝗦𝗨𝗣𝗣𝗢𝗥𝗧 𝗚𝗥𝗢𝗨𝗣' },
                        type: 1
                    }
                ],
                headerType: 4
            },
            { quoted: msg }
        );
    });
};