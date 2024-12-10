import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import dbConnect from './db/connectDb.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8000;
app.use(express.json());

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  dbConnect();
});
