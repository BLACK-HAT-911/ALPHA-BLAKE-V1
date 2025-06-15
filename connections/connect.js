const makeWASocket = require('@whiskeysockets/baileys').default;
const { useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');
const fs = require('fs');

const { logger } = require('./lib/logger');
const { startHandlers } = require('./handlers/eventsHandler');
const { handleGroupEvents } = require('./handlers/group-Handler');
const { handleCall } = require('./handlers/callHandler');
const { handlePresence } = require('./handlers/presenceHandler');
const { handleAnti } = require('./handlers/antiHandler');

const SESSION_DIR = './session';

const connectToWhatsApp = async () => {
  const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);
  const { version, isLatest } = await fetchLatestBaileysVersion();
  
  const sock = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: true,
    auth: state,
    browser: ['AlphaBlakeV1', 'Safari', '1.0.0']
  });
  
  // Connection status
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;
    
    if (qr) {
      console.log('[📸 QR] Scan the QR Code above to log in.\n');
    }
    
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut);
      
      logger.warn(`📴 Connection closed. Reason: ${DisconnectReason[lastDisconnect?.error?.output?.statusCode] || 'Unknown'}`);
      if (shouldReconnect) {
        logger.info('🔄 Attempting to reconnect...');
        connectToWhatsApp(); // Retry
      } else {
        logger.error('❌ You are logged out. Delete the session folder and restart.');
      }
    }
    
    if (connection === 'open') {
      logger.success('✅ Successfully connected to WhatsApp!');
    }
  });
  
  // Credentials updated
  sock.ev.on('creds.update', saveCreds);
  
  // Handlers
  startHandlers(sock);
  handleGroupEvents(sock);
  handleCall(sock);
  handlePresence(sock);
  handleAnti(sock);
  
  return sock;
};

module.exports = { connectToWhatsApp };