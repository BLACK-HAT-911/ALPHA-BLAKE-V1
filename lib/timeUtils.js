const moment = require('moment-timezone');

/**
 * Format duration in ms to readable string
 * @param {number} ms - milliseconds
 * @returns {string}
 */
const formatDuration = (ms) => {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  
  const segments = [];
  if (days > 0) segments.push(`${days}d`);
  if (hours > 0) segments.push(`${hours}h`);
  if (minutes > 0) segments.push(`${minutes}m`);
  if (seconds > 0) segments.push(`${seconds}s`);
  
  return segments.join(' ') || '0s';
};

/**
 * Get current time in specific timezone
 * @param {string} tz - e.g. "Africa/Harare"
 * @param {string} format - optional moment.js format
 * @returns {string}
 */
const getTime = (tz = 'Africa/Harare', format = 'dddd, MMMM Do YYYY | h:mm:ss A') => {
  return moment().tz(tz).format(format);
};

/**
 * Get current time as ISO string
 * @returns {string}
 */
const getTimestamp = () => {
  return new Date().toISOString();
};

/**
 * Convert seconds to HH:mm:ss
 * @param {number} seconds 
 * @returns {string}
 */
const secondsToHMS = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s]
    .map(unit => unit < 10 ? '0' + unit : unit)
    .join(':');
};

module.exports = {
  formatDuration,
  getTime,
  getTimestamp,
  secondsToHMS
};