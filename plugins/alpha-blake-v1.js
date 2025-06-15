require('dotenv').config();
const fs = require('fs');
const path = require('path');
const Pino = require('pino');
const makeWASocket = require('@whiskeysockets/baileys').default;
const { useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');

// === BOT INFO ===
const BOT_NAME = 'ALPHA-BLAKE-V1';
const IMAGE_URL = 'https://files.catbox.moe/radonm.jpg';
const CHANNEL_LINK = 'https://whatsapp.com/channel/0029Vb5a5G4IHphKUhO9hx0d';

const startBot = async () => {
  const { state, saveCreds } = await useMultiFileAuthState('./session');
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    auth: state,
    version,
    logger: Pino({ level: 'silent' }),
    printQRInTerminal: true,
    browser: ['ALPHA-BLAKE-V1', 'Chrome', '110.0.0.0']
  });

  // Load plugins
  const pluginFolder = path.join(__dirname, 'plugins');
  fs.readdirSync(pluginFolder).forEach(file => {
    if (file.endsWith('.js')) {
      try {
        require(path.join(pluginFolder, file))(sock);
        console.log(`✅ Loaded plugin: ${file}`);
      } catch (err) {
        console.error(`❌ Error loading plugin ${file}:`, err.message);
      }
    }
  });

  // Handle connection updates
  sock.ev.on('connection.update', update => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== 401;
      console.log('⚠️ Connection closed. Reconnecting...', shouldReconnect);
      if (shouldReconnect) startBot();
    } else if (connection === 'open') {
      console.log('✅ Connected to WhatsApp!');
    }
  });

  // Save creds
  sock.ev.on('creds.update', saveCreds);

  // Confirmation message
  setTimeout(async () => {
    try {
      await sock.sendMessage(sock.user.id, {
        image: { url: IMAGE_URL },
        caption: `🤖 *${BOT_NAME} is up and running!*\n\n✅ Connected & Active!\n\n📢 Stay updated:\n${CHANNEL_LINK}`,
        footer: BOT_NAME,
        buttons: [
          {
            buttonId: 'channel',
            buttonText: { displayText: '📢 Visit Channel' },
            type: 1
          }
        ],
        headerType: 4
      });
    } catch (err) {
      console.error('❌ Failed to send startup message:', err.message);
    }
  }, 4000);
};

startBot();