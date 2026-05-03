const mongoose = require('mongoose');

/**
 * Establishes a connection to MongoDB using the MONGO_URI env variable.
 * Exits the process on connection failure to avoid silent errors.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`[DB] MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[DB] Connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
