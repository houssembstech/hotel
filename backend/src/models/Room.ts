import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  hotelId: { type: String, required: true }, // For multi-hotel support
  roomNumber: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['Standard', 'Deluxe', 'Suite'], 
    required: true 
  },
  pricePerNight: { type: Number, required: true },
  capacity: {
    adults: { type: Number, required: true },
    children: { type: Number, required: true }
  },
  amenities: [{ type: String }],
  photos: [{ type: String }], // Cloudinary URLs
  status: {
    type: String,
    enum: ['AVAILABLE', 'OCCUPIED', 'CLEANING', 'MAINTENANCE'],
    default: 'AVAILABLE'
  }
}, { timestamps: true });

export default mongoose.model('Room', roomSchema);
