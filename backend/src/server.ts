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
import roomRoutes from './routes/rooms';
import eventRoutes from './routes/events';
import diningRoutes from './routes/dining';
import serviceRoutes from './routes/services';
import receptionRoutes from './routes/reception';

app.use('/api/health', (req, res) => {
  res.json({ status: 'API is running' });
});

// Register API Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/dining', diningRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/reception', receptionRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
