import mongoose from 'mongoose';

const servicesRequestSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  guestId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['ROOM_SERVICE', 'HOUSEKEEPING', 'MAINTENANCE'],
    required: true
  },
  details: { type: String, required: true },
  status: {
    type: String,
    enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED'],
    default: 'OPEN'
  }
}, { timestamps: true });

export default mongoose.model('ServicesRequest', servicesRequestSchema);
