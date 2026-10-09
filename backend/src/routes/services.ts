import { Router } from 'express';
import ServiceExtra from '../models/ServiceExtra';
import HotelPolicy from '../models/HotelPolicy';

const router = Router();

// =======================
// SERVICES CATALOG
// =======================
router.get('/', async (req, res) => {
  try {
    const extras = await ServiceExtra.find();
    res.json(extras);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

router.post('/', async (req, res): Promise<any> => {
  try {
    const newExtra = await ServiceExtra.create({ hotelId: 'MONO-LUMINA', ...req.body });
    res.status(201).json(newExtra);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create service extra' });
  }
});

router.delete('/:id', async (req, res): Promise<any> => {
  try {
    await ServiceExtra.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

// =======================
// HOTEL POLICIES
// =======================
router.get('/policies', async (req, res): Promise<any> => {
  try {
    let policy = await HotelPolicy.findOne({ hotelId: 'MONO-LUMINA' });
    if (!policy) {
      // create default
      policy = await HotelPolicy.create({ hotelId: 'MONO-LUMINA' });
    }
    res.json(policy);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch policies' });
  }
});

router.put('/policies', async (req, res): Promise<any> => {
  try {
    const policy = await HotelPolicy.findOneAndUpdate(
      { hotelId: 'MONO-LUMINA' }, 
      req.body, 
      { new: true, upsert: true }
    );
    res.json(policy);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update policies' });
  }
});

export default router;
