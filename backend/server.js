import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import postRoutes from './routes/post.route.js';
import notificationRoutes from './routes/notification.route.js';
import dbConnect from './db/connectDb.js';
import cookieParser from 'cookie-parser';
import logger from './lib/utils/logger.js';

const app = express();
const PORT = process.env.PORT || 8000;

// Middlewares

// To parse JSON data
app.use(express.json({ limit: '50mb' }));

// To parse form data(urlencoded)
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/notifications', notificationRoutes);

// Server start up
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  dbConnect();
});
