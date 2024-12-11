import mongoose from 'mongoose';
import logger from '../lib/utils/logger.js';

const dbConnect = async () => {
  try {
    const db = await mongoose.connect(process.env.DATABASE_URL);
    logger.info(`Connected to database on port: ${db.connection.port}`);
  } catch (error) {
    logger.error(`Error connecting to database: ${error.message}`);
    process.exit(1);
  }
};

export default dbConnect;
