const chalk = require('chalk');
const moment = require('moment');

// 💬 Timestamp format
const timestamp = () => chalk.gray(`[${moment().format('HH:mm:ss')}]`);

const logger = {
  info: (msg) => {
    console.log(`${timestamp()} ${chalk.blueBright('[INFO]')} ${msg}`);
  },
  
  warn: (msg) => {
    console.log(`${timestamp()} ${chalk.keyword('orange')('[WARN]')} ${msg}`);
  },
  
  success: (msg) => {
    console.log(`${timestamp()} ${chalk.green('[OK✓]')} ${msg}`);
  },
  
  error: (msg) => {
    console.error(`${timestamp()} ${chalk.redBright('[ERROR]')} ${msg}`);
  },
  
  event: (event, detail = '') => {
    console.log(`${timestamp()} ${chalk.magenta('[EVENT]')} ${chalk.white(event)} ${chalk.gray(detail)}`);
  },
  
  command: (cmd, from) => {
    console.log(`${timestamp()} ${chalk.cyan('[CMD]')} ${chalk.yellow(cmd)} from ${chalk.gray(from)}`);
  }
};

module.exports = logger;