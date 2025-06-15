const axios = require('axios');
const chalk = require('chalk');
const moment = require('moment');
const util = require('util');
const { performance } = require('perf_hooks');

module.exports = {
  /**
   * Console log with color
   */
  log: (text, color = 'green') => {
    console.log(chalk[color](text));
  },
  
  /**
   * Fetch buffer from URL
   */
  getBuffer: async (url, options = {}) => {
    try {
      const res = await axios({
        method: 'get',
        url,
        headers: {
          'DNT': 1,
          'Upgrade-Insecure-Request': 1,
        },
        responseType: 'arraybuffer',
        ...options,
      });
      return res.data;
    } catch (err) {
      console.error('Error fetching buffer:', err);
      throw err;
    }
  },
  
  /**
   * Random emoji
   */
  pickRandomEmoji: () => {
    const emojis = ['😀', '😎', '🤖', '👾', '🦾', '🚀', '🔥', '💻', '📱', '🎮'];
    return emojis[Math.floor(Math.random() * emojis.length)];
  },
  
  /**
   * Sleep (ms)
   */
  sleep: async (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  
  /**
   * Get formatted uptime
   */
  formatUptime: (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h}h ${m}m ${s}s`;
  },
  
  /**
   * Format runtime since process start
   */
  getRuntime: () => {
    const uptime = process.uptime();
    return module.exports.formatUptime(uptime);
  },
  
  /**
   * Format time
   */
  formatTime: (timestamp = Date.now()) => {
    return moment(timestamp).format('HH:mm:ss');
  },
  
  /**
   * Format date
   */
  formatDate: (timestamp = Date.now()) => {
    return moment(timestamp).format('dddd, MMMM Do YYYY');
  },
  
  /**
   * Sanitize mentions in messages
   */
  cleanMentionedJid: (text = '') => {
    return text.replace(/@([0-9]{5,})/g, '');
  },
  
  /**
   * Format bytes
   */
  formatBytes: (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  },
  
  /**
   * Format ping
   */
  getPing: async () => {
    const start = performance.now();
    await axios.get('https://www.google.com');
    const end = performance.now();
    return `${Math.floor(end - start)}ms`;
  },
  
  /**
   * Get JSON from URL
   */
  getJson: async (url, config = {}) => {
    const res = await axios.get(url, config);
    return res.data;
  },
  
  /**
   * Convert string to proper case
   */
  toTitleCase: (str) => {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  },
  
  /**
   * Debug util
   */
  debug: (data) => {
    console.log(util.inspect(data, {
      showHidden: false,
      depth: null,
      colors: true
    }));
  }
};