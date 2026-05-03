const levels = { error: 0, warn: 1, info: 2, debug: 3 };
const currentLevel = process.env.NODE_ENV === 'production' ? 'warn' : 'debug';

function shouldLog(level) {
  return levels[level] <= levels[currentLevel];
}

function formatMessage(level, message) {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
}

const logger = {
  error(message) {
    if (shouldLog('error')) process.stderr.write(formatMessage('error', message) + '\n');
  },
  warn(message) {
    if (shouldLog('warn')) process.stdout.write(formatMessage('warn', message) + '\n');
  },
  info(message) {
    if (shouldLog('info')) process.stdout.write(formatMessage('info', message) + '\n');
  },
  debug(message) {
    if (shouldLog('debug')) process.stdout.write(formatMessage('debug', message) + '\n');
  },
};

module.exports = logger;
