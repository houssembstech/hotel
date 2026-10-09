import { Router } from 'express';
import DiningItem from '../models/Dining';

const router = Router();

// GET all menu items
router.get('/', async (req, res) => {
  try {
    const items = await DiningItem.find().sort({ category: 1, name: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dining items' });
  }
});

// POST Create a new menu item / formula
router.post('/', async (req, res): Promise<any> => {
  try {
    const newItem = await DiningItem.create({
      hotelId: 'MONO-LUMINA',
      ...req.body
    });
    res.status(201).json(newItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create dining item' });
  }
});

// PUT Update a menu item (e.g. toggle availability, change price)
router.put('/:id', async (req, res): Promise<any> => {
  try {
    const updated = await DiningItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update dining item' });
  }
});

// DELETE a menu item
router.delete('/:id', async (req, res): Promise<any> => {
  try {
    await DiningItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Dining item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete dining item' });
  }
});

export default router;
