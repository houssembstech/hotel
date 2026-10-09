import { Router } from 'express';
import bcrypt from 'bcryptjs';
import Hotel from '../models/Hotel';
import User from '../models/User';
import Folio from '../models/Folio';
import ShiftSession from '../models/ShiftSession';

const router = Router();

// GET financial overview
router.get('/financials', async (req, res): Promise<any> => {
  try {
    const folios = await Folio.find();
    let totalRevenue = 0;
    let revAccommodation = 0;
    let revDining = 0;
    let revSpa = 0;
    
    let cashPayments = 0;
    let cardPayments = 0;
    let bankPayments = 0;

    // Monthly evolution buckets for the last 6 months
    const monthlyEvolution: { [key: string]: number } = {};
    const monthNames = ["Jan", "Fev", "Mar", "Avr", "Mai", "Jun", "Jul", "Aou", "Sep", "Oct", "Nov", "Dec"];
    
    const today = new Date();
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
       const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
       const key = `${d.getFullYear()}-${d.getMonth()}`;
       last6Months.push({ key, label: monthNames[d.getMonth()] });
       monthlyEvolution[key] = 0;
    }

    folios.forEach(folio => {
      // items
      folio.items.forEach(item => {
        const amt = item.amount * (item.quantity || 1);
        totalRevenue += amt;
        if (item.category === 'ROOM') revAccommodation += amt;
        else if (item.category === 'DINING') revDining += amt;
        else if (item.category === 'SPA') revSpa += amt;
        
        // Populate monthly evolution if within last 6 months
        const itemDate = new Date(item.date || folio.createdAt);
        const itemKey = `${itemDate.getFullYear()}-${itemDate.getMonth()}`;
        if (monthlyEvolution[itemKey] !== undefined) {
           monthlyEvolution[itemKey] += amt;
        }
      });

      // payments
      folio.payments.forEach(pay => {
        if (pay.method === 'CASH') cashPayments += pay.amount;
        if (pay.method === 'CARD') cardPayments += pay.amount;
        if (pay.method === 'BANK_TRANSFER') bankPayments += pay.amount;
      });
    });

    const monthlyChart = last6Months.map(m => ({
       label: m.label,
       total: monthlyEvolution[m.key]
    }));

    const shifts = await ShiftSession.find({ status: 'CLOSED' }).sort({ endTime: -1 });

    res.json({
      revenue: {
        total: totalRevenue,
        accommodation: revAccommodation,
        dining: revDining,
        spa: revSpa
      },
      payments: {
        cash: cashPayments,
        card: cardPayments,
        bank: bankPayments
      },
      monthlyChart,
      shifts
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch financials' });
  }
});

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
    delete (userObj as any).passwordHash;

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
