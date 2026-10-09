import mongoose from 'mongoose';

const serviceExtraSchema = new mongoose.Schema({
  hotelId: { type: String, required: true },
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['SPA', 'TRANSPORT', 'CHAMBRE', 'AUTRE'], 
    required: true 
  },
  price: { type: Number, required: true },
  pricingType: {
    type: String,
    enum: ['UNITAIRE', 'PAR_NUIT', 'PAR_PERSONNE'],
    default: 'UNITAIRE'
  },
  photo: { type: String }, // Cloudinary URL
  description: { type: String }
}, { timestamps: true });

export default mongoose.model('ServiceExtra', serviceExtraSchema);
