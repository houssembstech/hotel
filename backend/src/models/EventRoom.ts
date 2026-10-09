import mongoose from 'mongoose';

const eventRoomSchema = new mongoose.Schema({
  hotelId: { type: String, required: true },
  name: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['Conference', 'Mariage', 'Reunion', 'Exposition'], 
    required: true 
  },
  capacity: {
    theatre: { type: Number, default: 0 },
    banquet: { type: Number, default: 0 },
    uShape: { type: Number, default: 0 }
  },
  pricing: {
    hourly: { type: Number, required: true },
    halfDay: { type: Number },
    fullDay: { type: Number }
  },
  equipment: [{ type: String }],
  photos: [{ type: String }],
  status: {
    type: String,
    enum: ['AVAILABLE', 'MAINTENANCE'],
    default: 'AVAILABLE'
  }
}, { timestamps: true });

export default mongoose.model('EventRoom', eventRoomSchema);
