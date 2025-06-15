const fs = require('fs');
const path = require('path');
const util = require('util');
const chalk = require('chalk');
const moment = require('moment-timezone');

const pluginsPath = path.join(__dirname, '../plugins');
const plugins = fs.readdirSync(pluginsPath).filter(file => file.endsWith('.js'));

const commands = {};
for (const file of plugins) {
  try {
    const plugin = require(path.join(pluginsPath, file));
    if (plugin.command && typeof plugin.run === 'function') {
      if (Array.isArray(plugin.command)) {
        plugin.command.forEach(cmd => commands[cmd] = plugin.run);
      } else {
        commands[plugin.command] = plugin.run;
      }
    }
  } catch (e) {
    console.error(chalk.red(`Error loading plugin ${file}: ${e.message}`));
  }
}

const isOwner = (jid, ownerNumber) => jid === `${ownerNumber}@s.whatsapp.net`;

module.exports = async function messageHandler(sock, msg, store, config) {
  try {
    const from = msg.key.remoteJid;
    const sender = msg.key.participant || msg.key.remoteJid;
    const isGroup = from.endsWith('@g.us');
    const pushName = msg.pushName || 'Unknown';
    const ownerNumber = config.owner || '263784812740'; // Change this
    
    let body = '';
    if (msg.message?.conversation) body = msg.message.conversation;
    else if (msg.message?.extendedTextMessage?.text) body = msg.message.extendedTextMessage.text;
    else if (msg.message?.imageMessage?.caption) body = msg.message.imageMessage.caption;
    else if (msg.message?.videoMessage?.caption) body = msg.message.videoMessage.caption;
    else if (msg.message?.buttonsResponseMessage?.selectedButtonId) body = msg.message.buttonsResponseMessage.selectedButtonId;
    else if (msg.message?.listResponseMessage?.singleSelectReply?.selectedRowId) body = msg.message.listResponseMessage.singleSelectReply.selectedRowId;
    
    const prefix = config.prefix || '.';
    if (!body.startsWith(prefix)) return;
    
    const args = body.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    
    if (!commands[commandName]) return;
    
    console.log(
      chalk.greenBright(`[CMD]`),
      chalk.cyanBright(commandName),
      chalk.gray(`from ${pushName} ${isGroup ? 'in group' : 'in private'}`)
    );
    
    await commands[commandName]({
      sock,
      msg,
      args,
      from,
      sender,
      isGroup,
      isOwner: isOwner(sender, ownerNumber),
      store,
      config
    });
    
  } catch (err) {
    console.error(chalk.red('Message Handler Error:'), err);
  }
};