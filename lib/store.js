const { makeInMemoryStore, useMultiFileAuthState, jidNormalizedUser } = require('@whiskeysockets/baileys');
const { join } = require('path');
const fs = require('fs');

// 📁 Define where store data will be saved
const storeFile = join(__dirname, '../session_store/store.json');

// 🧠 Create in-memory store
const store = makeInMemoryStore({
  logger: {
    info: () => {},
    warn: () => {},
    error: console.error
  }
});

// 💾 Load store from file if exists
if (fs.existsSync(storeFile)) {
  store.readFromFile(storeFile);
  console.log('[STORE] Loaded saved store data.');
}

// 🕒 Auto-save store to file every 30s
setInterval(() => {
  store.writeToFile(storeFile);
}, 30 * 1000);

// 🧪 Bind store to Baileys socket
function bindStore(sock) {
  store.bind(sock.ev);
}

// 🧾 Accessor utilities
const getUserName = (jid) => {
  const contact = store.contacts[jidNormalizedUser(jid)];
  return contact?.notify || contact?.name || contact?.verifiedName || 'Unknown';
};

const getAllGroups = () => {
  return Object.values(store.chats)
    .filter(chat => chat.id.endsWith('@g.us'))
    .map(chat => chat.id);
};

const getAllUsers = () => {
  return Object.values(store.contacts).map(c => c.id);
};

module.exports = {
  store,
  bindStore,
  getUserName,
  getAllGroups,
  getAllUsers
};