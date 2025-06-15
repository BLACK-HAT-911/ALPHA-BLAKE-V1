const fs = require('fs');
const path = require('path');
const { proto } = require('@whiskeysockets/baileys');
const config = require('./config');

// Custom emoji list (sample of 300+ emojis — feel free to expand)
const emojis = [
  '🔥', '😂', '😍', '💀', '😎', '👍', '🥶', '😭', '👻', '🧠', '🫡', '😈', '🤖', '💩', '🥷',
  '👽', '⚡', '❤️', '💥', '🧨', '🌪️', '🌈', '🕊️', '☠️', '😱', '😡', '🙃', '🤡', '🚀', '🌍',
  '🎭', '🌀', '🦾', '🥵', '👁️‍🗨️', '🐍', '🩸', '💔', '👑', '🎯', '💣', '📸', '🥺', '✨', '🖕'
];

// Image list including your branding image
const reactionImages = [
  'https://files.catbox.moe/radonm.jpg', // Your branding
  'https://i.imgur.com/zrvjVnS.jpeg',
  'https://i.imgur.com/eYZz1cr.jpeg',
  'https://i.imgur.com/EQoJ5ZG.jpeg'
];

// React with random emoji from the list
async function autoReact(sock, msg) {
  try {
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    await sock.sendMessage(msg.key.remoteJid, {
      react: {
        text: randomEmoji,
        key: msg.key
      }
    });
  } catch (error) {
    console.error('Auto-react error:', error);
  }
}

// Send a reaction image reply
async function imageReact(sock, msg) {
  try {
    const randomImage = reactionImages[Math.floor(Math.random() * reactionImages.length)];
    await sock.sendMessage(msg.key.remoteJid, {
      image: { url: randomImage },
      caption: '💫 Here’s a cool reaction from ALPHA-BLAKE-V1!'
    }, { quoted: msg });
  } catch (error) {
    console.error('Image react error:', error);
  }
}

// Manual emoji reaction (use: .react 😎)
async function manualReact(sock, msg, emoji) {
  try {
    if (!emoji || emoji.length > 3) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ Provide a valid emoji. Example: `.react 😎`'
      }, { quoted: msg });
      return;
    }
    
    await sock.sendMessage(msg.key.remoteJid, {
      react: {
        text: emoji,
        key: msg.key
      }
    });
  } catch (error) {
    console.error('Manual react error:', error);
  }
}

module.exports = {
  autoReact,
  manualReact,
  imageReact,
  emojis,
  reactionImages
};