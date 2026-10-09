import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  hotelId: { type: String, required: true }, // For multi-hotel support
  roomNumber: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['Standard', 'Deluxe', 'Suite'], 
    required: true 
  },
  floor: { type: Number, default: 1 },
  pricePerNight: { type: Number, required: true },
  capacity: {
    adults: { type: Number, required: true },
    children: { type: Number, required: true }
  },
  amenities: [{ type: String }],
  photos: [{ type: String }], // Cloudinary URLs
  status: {
    type: String,
    enum: ['AVAILABLE', 'OCCUPIED', 'CLEANING', 'CLEANING_NEEDED', 'MAINTENANCE'],
    default: 'AVAILABLE'
  },
  currentLock: {
    agentName: { type: String, default: null },
    expiresAt: { type: Date, default: null }
  }
}, { timestamps: true });

export default mongoose.model('Room', roomSchema);
