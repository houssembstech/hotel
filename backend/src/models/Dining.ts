import mongoose from 'mongoose';

const diningItemSchema = new mongoose.Schema({
  hotelId: { type: String, required: true },
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Formule Pension', 'Entrée', 'Plat', 'Dessert', 'Boisson'], 
    required: true 
  },
  price: { type: Number, required: true },
  ingredients: { type: String, required: true }, // Simplified as a comma-separated string for UI
  allergens: [{ type: String }],
  photo: { type: String }, // Cloudinary URL
  isAvailable: { type: Boolean, default: true } // Dynamic stock management
}, { timestamps: true });

export default mongoose.model('DiningItem', diningItemSchema);
