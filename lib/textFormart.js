/**
 * Capitalizes the first letter of each word
 * @param {string} text
 * @returns {string}
 */
const capitalizeWords = (text) => {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Converts all text to lowercase
 * @param {string} text
 * @returns {string}
 */
const toLowerCase = (text) => text.toLowerCase();

/**
 * Converts all text to uppercase
 * @param {string} text
 * @returns {string}
 */
const toUpperCase = (text) => text.toUpperCase();

/**
 * Make bold using WhatsApp formatting
 * @param {string} text
 * @returns {string}
 */
const bold = (text) => `*${text}*`;

/**
 * Make italic using WhatsApp formatting
 * @param {string} text
 * @returns {string}
 */
const italic = (text) => `_${text}_`;

/**
 * Make monospace using WhatsApp formatting
 * @param {string} text
 * @returns {string}
 */
const monospace = (text) => '```' + text + '```';

/**
 * Format a quoted message
 * @param {string} text
 * @returns {string}
 */
const quote = (text) => `> ${text.split('\n').join('\n> ')}`;

/**
 * Remove special characters except basic punctuation
 * @param {string} text
 * @returns {string}
 */
const sanitize = (text) => text.replace(/[^\w\s.,!?'"@#&()-]/g, '');

/**
 * Format an array of user IDs into mentions
 * @param {string[]} ids - e.g. ['123456@s.whatsapp.net']
 * @returns {string}
 */
const formatMentions = (ids) => {
  return ids.map(id => `@${id.split('@')[0]}`).join(' ');
};

module.exports = {
  capitalizeWords,
  toLowerCase,
  toUpperCase,
  bold,
  italic,
  monospace,
  quote,
  sanitize,
  formatMentions
};