import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import postRoutes from './routes/post.route.js';
import notificationRoutes from './routes/notification.route.js';
import dbConnect from './db/connectDb.js';
import cookieParser from 'cookie-parser';
import logger from './lib/utils/logger.js';

const app = express();
const PORT = process.env.PORT || 8000;
const __dirname = path.resolve();

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

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
  });
}

// Global error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.message); // Log the error message
  res.status(err.status || 500).json({ error: err.message });
});

// Server start up
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  dbConnect();
});
