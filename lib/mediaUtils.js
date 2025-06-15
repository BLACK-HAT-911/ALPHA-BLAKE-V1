const {
  downloadContentFromMessage,
  generateForwardMessageContent,
  generateWAMessageFromContent,
} = require('@whiskeysockets/baileys');

const fs = require('fs');
const path = require('path');
const FileType = require('file-type');
const axios = require('axios');

/**
 * Download media from a Baileys message object
 */
const downloadMedia = async (message, type, filename) => {
  try {
    const stream = await downloadContentFromMessage(message, type);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    
    const fileType = await FileType.fromBuffer(buffer);
    const finalFileName = filename + (fileType ? `.${fileType.ext}` : '');
    const filePath = path.join(__dirname, '../temp', finalFileName);
    
    fs.writeFileSync(filePath, buffer);
    return {
      buffer,
      filePath,
      fileType
    };
  } catch (err) {
    console.error('[MediaUtils] Download error:', err);
    return null;
  }
};

/**
 * Get file buffer from URL
 */
const getBuffer = async (url, headers = {}) => {
  try {
    const response = await axios.get(url, {
      headers,
      responseType: 'arraybuffer',
    });
    return response.data;
  } catch (err) {
    console.error('[MediaUtils] Buffer fetch failed:', err);
    return null;
  }
};

/**
 * Get FileType of buffer or file
 */
const detectFileType = async (bufferOrPath) => {
  try {
    if (Buffer.isBuffer(bufferOrPath)) {
      return await FileType.fromBuffer(bufferOrPath);
    } else {
      const fileBuffer = fs.readFileSync(bufferOrPath);
      return await FileType.fromBuffer(fileBuffer);
    }
  } catch (e) {
    console.error('[MediaUtils] FileType detection failed:', e);
    return null;
  }
};

/**
 * Forward media with view-once bypass
 */
const forwardViewOnce = async (sock, msg, to) => {
  try {
    const type = Object.keys(msg.message)[0];
    const content = await generateForwardMessageContent(msg, false, { readViewOnce: true });
    const waMsg = await generateWAMessageFromContent(to, content.message, { userJid: sock.user.id, quoted: msg });
    await sock.relayMessage(to, waMsg.message, { messageId: waMsg.key.id });
  } catch (err) {
    console.error('[MediaUtils] View-once forward error:', err);
  }
};

module.exports = {
  downloadMedia,
  getBuffer,
  detectFileType,
  forwardViewOnce
};