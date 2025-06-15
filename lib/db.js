const fs = require('fs');
const path = require('path');

// 🌐 Path to database file
const dbPath = path.join(__dirname, '../database.json');

// 🧠 Initial structure
const defaultDB = {
  users: {}, // Example: users['123@s.whatsapp.net'] = { name, warned, isBanned, ... }
  groups: {}, // Example: groups['123-456@g.us'] = { welcome, antiMention, ... }
  settings: {}, // Global settings or bot flags
  stats: {}, // Optional: usage counters
};

// 📖 Load DB or create new
let db = { ...defaultDB };
if (fs.existsSync(dbPath)) {
  try {
    db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    console.log('[DB] Database loaded successfully.');
  } catch (err) {
    console.error('[DB] Failed to load DB, using fresh state.', err);
  }
}

// 💾 Auto save DB every 30s
setInterval(() => {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}, 30 * 1000);

// 🧪 Utility functions
const saveDB = () => {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
};

const getUser = (jid) => {
  if (!db.users[jid]) db.users[jid] = { warned: 0, isBanned: false, name: null };
  return db.users[jid];
};

const getGroup = (jid) => {
  if (!db.groups[jid]) db.groups[jid] = { welcome: false, antiMention: false, banned: false };
  return db.groups[jid];
};

const isBanned = (jid) => getUser(jid).isBanned;
const banUser = (jid) => { getUser(jid).isBanned = true; };
const unbanUser = (jid) => { getUser(jid).isBanned = false; };

module.exports = {
  db,
  saveDB,
  getUser,
  getGroup,
  isBanned,
  banUser,
  unbanUser
};