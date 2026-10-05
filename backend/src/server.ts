import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

import uploadRoutes from './routes/upload';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';

app.use('/api/health', (req, res) => {
  res.json({ status: 'API is running' });
});

// Register API Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
