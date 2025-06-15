const { connectToWhatsApp } = require('./connect');
const { logger } = require('./lib/logger');

// Entry point for ALPHA-BLAKE-V1
(async () => {
  try {
    logger.info('🚀 Launching ALPHA-BLAKE-V1...');
    await connectToWhatsApp();
    logger.info('✅ Bot is now online and connected to WhatsApp.');
  } catch (err) {
    logger.error('❌ Failed to start ALPHA-BLAKE-V1:', err);
    process.exit(1); // Exit process on error
  }
})();

// Graceful shutdown handling
process.on('unhandledRejection', (reason, promise) => {
  logger.error('🧨 Unhandled Promise Rejection:', reason);
});

process.on('SIGINT', () => {
  logger.warn('👋 Shutting down ALPHA-BLAKE-V1...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.warn('📴 Process terminated.');
  process.exit(0);
});