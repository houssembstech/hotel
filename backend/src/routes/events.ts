import { Router } from 'express';
import EventRoom from '../models/EventRoom';
import EventBooking from '../models/EventBooking';

const router = Router();

// ===============================
// EVENT BOOKINGS
// ===============================
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await EventBooking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch event bookings' });
  }
});

router.post('/bookings', async (req, res): Promise<any> => {
  try {
    const { eventRoomId, startDate, endDate } = req.body;
    
    // Convert to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end < start) {
       return res.status(400).json({ error: 'La date de fin doit être postérieure à la date de début.' });
    }

    // Calculate 2 hour buffer dynamically
    const twoHoursMs = 2 * 60 * 60 * 1000;
    const startWithBuffer = new Date(start.getTime() - twoHoursMs);
    const endWithBuffer = new Date(end.getTime() + twoHoursMs);

    // Check for overlaps INCLUDING the 2-hour safety gap
    const conflictingBooking = await EventBooking.findOne({
      eventRoomId: eventRoomId,
      $and: [
        { startDate: { $lt: endWithBuffer } },
        { endDate: { $gt: startWithBuffer } }
      ]
    });

    if (conflictingBooking) {
       return res.status(409).json({ error: 'Erreur: Veuillez laisser au moins 2 heures de battement entre les réservations pour le nettoyage.' });
    }

    const newBooking = await EventBooking.create(req.body);
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create event booking' });
  }
});

router.delete('/bookings/:id', async (req, res): Promise<any> => {
  try {
    await EventBooking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted booking' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

// ===============================
// EVENT ROOMS INVENTORY
// ===============================
// GET all event rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await EventRoom.find().sort({ name: 1 });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch event rooms' });
  }
});

// POST Create an event room
router.post('/', async (req, res): Promise<any> => {
  try {
    const newRoom = await EventRoom.create({
      hotelId: 'MONO-LUMINA', // hardcoded for mono-establishment
      ...req.body
    });
    res.status(201).json(newRoom);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create event room' });
  }
});

// PUT Update an event room
router.put('/:id', async (req, res): Promise<any> => {
  try {
    const updated = await EventRoom.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update event room' });
  }
});

// DELETE an event room
router.delete('/:id', async (req, res): Promise<any> => {
  try {
    await EventRoom.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event room deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete event room' });
  }
});

export default router;
