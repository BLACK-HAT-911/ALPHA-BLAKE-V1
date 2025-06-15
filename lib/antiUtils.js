const { downloadContentFromMessage, getContentType } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const { proto } = require('@whiskeysockets/baileys');

// Store deleted messages
let deletedMessages = {};

async function detectLink(text) {
  return /(https?:\/\/[^\s]+)/gi.test(text);
}

// 🛡️ Anti-Link Handler
async function handleAntiLink(sock, msg) {
  const message = msg.message?.conversation || msg.message?.extendedTextMessage?.text;
  if (!message) return;
  
  const linkDetected = await detectLink(message);
  if (linkDetected) {
    await sock.sendMessage(msg.key.remoteJid, {
      text: `🚫 *Link detected!*\nStop spamming links, or you'll be kicked.`
    }, { quoted: msg });
    // Optionally: kick user, warn, etc.
  }
}

// 🛡️ Anti-Delete Handler
async function handleAntiDelete(sock, msg) {
  const { key } = msg;
  
  if (key.remoteJid.endsWith('@g.us') && key.participant) {
    const chatId = key.remoteJid;
    const sender = key.participant;
    
    const deleted = deletedMessages[key.id];
    if (deleted) {
      const type = getContentType(deleted.message);
      await sock.sendMessage(chatId, {
        text: `🕵️ *Message deleted by @${sender.split('@')[0]}*\nRecovered:\n\n*Type:* ${type}\n*Content:* ${JSON.stringify(deleted.message[type])}`,
        mentions: [sender]
      });
    }
  }
}

// Track all messages to recover on deletion
function trackMessage(msg) {
  deletedMessages[msg.key.id] = msg;
}

// 🛡️ Anti View-Once Handler
async function handleViewOnce(sock, msg) {
  try {
    const m = msg.message?.viewOnceMessageV2 || msg.message?.viewOnceMessage;
    if (!m) return;
    
    const type = getContentType(m.message);
    const media = await downloadContentFromMessage(m.message[type], type.replace('Message', ''));
    
    const buffer = Buffer.from([]);
    for await (const chunk of media) buffer.push(...chunk);
    
    await sock.sendMessage(msg.key.remoteJid, {
      [type.replace('Message', '')]: buffer,
      caption: '🔓 *View once message unlocked by ALPHA-BLAKE-V1*'
    }, { quoted: msg });
  } catch (err) {
    console.error('Anti-view-once error:', err);
  }
}

// 🛡️ Anti-Mention Bot
async function handleAntiMention(sock, msg) {
  const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
  const mentionedJidList = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
  
  if (mentionedJidList.includes(botNumber)) {
    await sock.sendMessage(msg.key.remoteJid, {
      text: `👀 You mentioned *ALPHA-BLAKE-V1*. Say something important or don't disturb... 😈`
    }, { quoted: msg });
  }
}

module.exports = {
  handleAntiLink,
  handleAntiDelete,
  handleViewOnce,
  handleAntiMention,
  trackMessage
};