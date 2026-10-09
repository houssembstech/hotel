import { Router } from 'express';
import Room from '../models/Room';

const router = Router();

// GET all rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find().sort({ roomNumber: 1 });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// POST Create a new room
router.post('/', async (req, res): Promise<any> => {
  try {
    const { roomNumber, type, floor, pricePerNight, capacity, amenities, photos, status } = req.body;
    const newRoom = await Room.create({
      hotelId: 'MONO-LUMINA', // hardcoded for mono-hotel
      roomNumber,
      type,
      floor: floor || 1,
      pricePerNight,
      capacity,
      amenities,
      photos,
      status: status || 'AVAILABLE'
    });
    res.status(201).json(newRoom);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create room' });
  }
});

// PUT Update a room status/details
router.put('/:id', async (req, res): Promise<any> => {
  try {
    const updated = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update room' });
  }
});

// DELETE a room
router.delete('/:id', async (req, res): Promise<any> => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: 'Room deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete room' });
  }
});

export default router;
