const axios = require('axios');

// ENV variables or fallback keys
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'your-openai-key';
const BLACKBOX_API = 'https://www.blackbox.ai/api/chat';
const DEEPSEEK_API = 'https://api.deepseek.com/chat';
const MATHAI_API = 'https://api.math-ai.xyz/solve';
const BINGAI_API = 'https://api.bingai.chat/message';

/**
 * ChatGPT 4
 */
async function askChatGPT(prompt) {
  try {
    const res = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    return res.data.choices[0].message.content.trim();
  } catch (err) {
    console.error('[ChatGPT4 Error]', err.message);
    return '❌ Failed to get a response from ChatGPT-4.';
  }
}

/**
 * Blackbox AI (for code-based queries)
 */
async function askBlackbox(prompt) {
  try {
    const res = await axios.post(BLACKBOX_API, {
      messages: [{ role: 'user', content: prompt }]
    });
    return res.data?.output || '⚠️ No response from Blackbox.';
  } catch (err) {
    console.error('[Blackbox Error]', err.message);
    return '❌ Blackbox AI failed.';
  }
}

/**
 * Bing AI (Creative chat)
 */
async function askBingAI(prompt) {
  try {
    const res = await axios.post(BINGAI_API, { prompt });
    return res.data?.response || '⚠️ No response from BingAI.';
  } catch (err) {
    console.error('[BingAI Error]', err.message);
    return '❌ Bing AI failed to respond.';
  }
}

/**
 * DeepSeek AI (Code understanding & generation)
 */
async function askDeepSeek(prompt) {
  try {
    const res = await axios.post(DEEPSEEK_API, {
      messages: [{ role: 'user', content: prompt }],
      model: 'deepseek-coder',
    });
    return res.data?.choices?.[0]?.message?.content || '⚠️ No DeepSeek response.';
  } catch (err) {
    console.error('[DeepSeek Error]', err.message);
    return '❌ DeepSeek API failed.';
  }
}

/**
 * Math AI (Equation solving)
 */
async function solveMathEquation(equation) {
  try {
    const res = await axios.post(MATHAI_API, { equation });
    return res.data?.result || '⚠️ Math AI could not solve that.';
  } catch (err) {
    console.error('[MathAI Error]', err.message);
    return '❌ Failed to solve the math equation.';
  }
}

module.exports = {
  askChatGPT,
  askBlackbox,
  askBingAI,
  askDeepSeek,
  solveMathEquation
};