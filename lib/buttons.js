const { proto } = require('@whiskeysockets/baileys');

/**
 * Send a message with buttons
 * @param {import('@whiskeysockets/baileys').WASocket} sock 
 * @param {string} jid 
 * @param {string} text 
 * @param {Array} buttons 
 * @param {object} quoted 
 * @param {string} footer 
 * @param {string|Buffer} image 
 */
const sendButtons = async (sock, jid, text, buttons = [], quoted = null, footer = '', image = null) => {
  const btnFormat = buttons.map((btn, i) => ({
    buttonId: btn.id || `id${i + 1}`,
    buttonText: { displayText: btn.text },
    type: 1
  }));

  const msg = {
    caption: text,
    footer: footer || 'ALPHA-BLAKE-V1 ⚡ Powered by JADEN',
    buttons: btnFormat,
    headerType: image ? 4 : 1
  };

  if (image) msg.image = (typeof image === 'string' ? { url: image } : { buffer: image });

  await sock.sendMessage(jid, msg, { quoted });
};

/**
 * Quick predefined channel button
 * @returns {Array}
 */
const getChannelButton = () => [
  {
    id: 'channel',
    text: '📢 Visit Official Channel'
  }
];

/**
 * Simple yes/no buttons
 * @returns {Array}
 */
const getYesNoButtons = () => [
  { id: 'yes', text: '✅ Yes' },
  { id: 'no', text: '❌ No' }
];

/**
 * Send simple reply button message
 * @param {import('@whiskeysockets/baileys').WASocket} sock 
 * @param {string} jid 
 * @param {string} text 
 * @param {Array} buttons 
 * @param {object} quoted 
 */
const sendQuickReply = async (sock, jid, text, buttons = [], quoted = null) => {
  const btns = buttons.map((btn, i) => ({
    buttonId: btn.id || `quick${i + 1}`,
    buttonText: { displayText: btn.text },
    type: 1
  }));

  await sock.sendMessage(jid, {
    text,
    buttons: btns,
    headerType: 1
  }, { quoted });
};

module.exports = {
  sendButtons,
  getChannelButton,
  getYesNoButtons,
  sendQuickReply
};