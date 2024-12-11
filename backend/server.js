import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import dbConnect from './db/connectDb.js';
import cookieParser from 'cookie-parser';
import logger from './lib/utils/logger.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  dbConnect();
});
