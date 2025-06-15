const {
  jidNormalizedUser,
  getContentType
} = require('@whiskeysockets/baileys');

const isAdmin = async (sock, jid, userId) => {
  try {
    const metadata = await sock.groupMetadata(jid);
    const participant = metadata.participants.find(p => jidNormalizedUser(p.id) === jidNormalizedUser(userId));
    return participant?.admin === 'admin' || participant?.admin === 'superadmin';
  } catch (e) {
    console.error('Failed to check admin:', e);
    return false;
  }
};

const getAdmins = async (sock, jid) => {
  try {
    const metadata = await sock.groupMetadata(jid);
    return metadata.participants.filter(p => p.admin).map(p => p.id);
  } catch (e) {
    console.error('Failed to get admins:', e);
    return [];
  }
};

const getGroupMetadata = async (sock, jid) => {
  try {
    const metadata = await sock.groupMetadata(jid);
    return metadata;
  } catch (e) {
    console.error('Error fetching group metadata:', e);
    return null;
  }
};

const getParticipantIds = async (sock, jid) => {
  try {
    const metadata = await sock.groupMetadata(jid);
    return metadata.participants.map(p => p.id);
  } catch (e) {
    console.error('Error getting participants:', e);
    return [];
  }
};

const mentionAll = async (sock, jid, msg, text) => {
  try {
    const metadata = await sock.groupMetadata(jid);
    const mentions = metadata.participants.map(p => p.id);
    await sock.sendMessage(jid, {
      text,
      mentions
    }, { quoted: msg });
  } catch (e) {
    console.error('MentionAll error:', e);
  }
};

const isGroup = (msg) => {
  return msg.key.remoteJid.endsWith('@g.us');
};

const isGroupAdmin = async (sock, msg) => {
  if (!isGroup(msg)) return false;
  return await isAdmin(sock, msg.key.remoteJid, msg.key.participant || msg.key.remoteJid);
};

module.exports = {
  isAdmin,
  getAdmins,
  getGroupMetadata,
  getParticipantIds,
  mentionAll,
  isGroup,
  isGroupAdmin,
};