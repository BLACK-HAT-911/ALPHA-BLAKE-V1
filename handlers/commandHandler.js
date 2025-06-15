const fs = require('fs');
const path = require('path');
const util = require('util');
const { getPrefix } = require('../lib/config');
const logger = require('../lib/logger');

const pluginsDir = path.join(__dirname, '../plugins');
const commandMap = new Map();

// Dynamically load all plugins
fs.readdirSync(pluginsDir).forEach(file => {
  if (file.endsWith('.js')) {
    const plugin = require(path.join(pluginsDir, file));
    if (plugin.command) {
      const commands = Array.isArray(plugin.command) ? plugin.command : [plugin.command];
      commands.forEach(cmd => commandMap.set(cmd, plugin));
    }
  }
});

/**
 * Handles commands
 * @param {Object} sock - Baileys socket instance
 * @param {Object} msg - WhatsApp message object
 */
module.exports = async function commandHandler(sock, msg) {
  try {
    const prefix = getPrefix(msg);
    const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
    if (!body.startsWith(prefix)) return;
    
    const args = body.slice(prefix.length).trim().split(/\s+/);
    const commandName = args.shift()?.toLowerCase();
    
    if (!commandMap.has(commandName)) return;
    
    const command = commandMap.get(commandName);
    
    // Owner-only command check
    if (command.owner && !msg.isOwner) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '🛑 This command is for *Bot Owner* only.',
      }, { quoted: msg });
    }
    
    // Group-only command check
    if (command.group && !msg.isGroup) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '👥 This command can only be used in *groups*.',
      }, { quoted: msg });
    }
    
    // Admin-only command check
    if (command.admin && !msg.isAdmin && !msg.isOwner) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '🚫 You must be a *Group Admin* to use this command.',
      }, { quoted: msg });
    }
    
    // Run the plugin handler
    await command.handler(sock, msg, args);
    
  } catch (err) {
    logger.error('❌ Command Error:', err);
    await sock.sendMessage(msg.key.remoteJid, {
      text: `⚠️ An error occurred while executing the command.\n\n${util.format(err)}`,
    }, { quoted: msg });
  }
};