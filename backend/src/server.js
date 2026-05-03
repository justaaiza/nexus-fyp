const env = require('./config/env');
const connectDB = require('./config/db');
const app = require('./app');
const logger = require('./utils/logger');

const startServer = async () => {
  await connectDB(env.MONGO_URI);

  app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT}`);
    logger.info(`Health check: http://localhost:${env.PORT}/health`);
  });
};

startServer();
