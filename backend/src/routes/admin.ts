import { Router } from 'express';
import bcrypt from 'bcryptjs';
import Hotel from '../models/Hotel';
import User from '../models/User';

const router = Router();

// GET all hotels
router.get('/hotels', async (req, res) => {
  try {
    const hotels = await Hotel.find().sort({ createdAt: -1 });
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch hotels' });
  }
});

// POST Create a new hotel
router.post('/hotels', async (req, res): Promise<any> => {
  try {
    const { name, email, phone, address, currency, timezone, taxRate, maxRooms } = req.body;
    const newHotel = await Hotel.create({
      name, email, phone, address, currency, timezone, taxRate, limits: { maxRooms }
    });
    res.status(201).json(newHotel);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create hotel' });
  }
});

// GET all directors and staff
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'GUEST' } }).select('-passwordHash');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
});

// POST create staff (Director)
router.post('/users', async (req, res): Promise<any> => {
  try {
    const { name, email, password, role } = req.body;
    
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'User email exists already' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name, email, passwordHash, role
    });
    
    // We shouldn't send the hash back
    const userObj = newUser.toObject();
    delete userObj.passwordHash;

    res.status(201).json(userObj);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// GET basic system stats
router.get('/stats', async (req, res) => {
  try {
    const hotelCount = await Hotel.countDocuments();
    const userCount = await User.countDocuments();
    res.json({
      hotels: hotelCount,
      users: userCount,
      status: 'Healthy',
      uptime: process.uptime()
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
