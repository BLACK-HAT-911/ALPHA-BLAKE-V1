const axios = require('axios');

/**
 * Generic GET request
 * @param {string} url
 * @returns {Promise<any>}
 */
const getRequest = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    console.error(`GET ${url} failed:`, err.message);
    return null;
  }
};

/**
 * Generic POST request
 * @param {string} url
 * @param {object} data
 * @param {object} headers
 * @returns {Promise<any>}
 */
const postRequest = async (url, data = {}, headers = {}) => {
  try {
    const response = await axios.post(url, data, { headers });
    return response.data;
  } catch (err) {
    console.error(`POST ${url} failed:`, err.message);
    return null;
  }
};

/**
 * Send AI Prompt to a GPT-like API
 * @param {string} prompt
 * @param {string} apiKey
 * @returns {Promise<string>}
 */
const sendToAI = async (prompt, apiKey) => {
  try {
    const response = await axios.post('https://api.dreaded.site/api/chatgpt', {
      text: prompt
    }, {
      headers: {
        'Authorization': apiKey
      }
    });
    return response.data?.response || 'No response';
  } catch (err) {
    console.error('AI API error:', err.message);
    return 'Error reaching AI';
  }
};

/**
 * Fetch GitHub repo details
 * @param {string} username
 * @returns {Promise<object|null>}
 */
const getGitHubProfile = async (username) => {
  return await getRequest(`https://api.github.com/users/${username}`);
};

/**
 * IP info lookup
 * @param {string} ip
 * @returns {Promise<object|null>}
 */
const getIPInfo = async (ip) => {
  return await getRequest(`http://ip-api.com/json/${ip}`);
};

module.exports = {
  getRequest,
  postRequest,
  sendToAI,
  getGitHubProfile,
  getIPInfo
};