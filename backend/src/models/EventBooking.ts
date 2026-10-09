import mongoose from 'mongoose';

const eventBookingSchema = new mongoose.Schema({
  eventRoomId: { type: mongoose.Schema.Types.ObjectId, ref: 'EventRoom', required: true },
  clientName: { type: String, required: true },
  eventName: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  billingType: {
    type: String,
    enum: ['HOURLY', 'HALF_DAY', 'FULL_DAY'],
    required: true
  },
  totalPrice: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['OPTION', 'CONFIRMED', 'CANCELLED'],
    default: 'CONFIRMED'
  },
  color: { type: String, default: 'emerald-500' } // for UI rendering purposes
}, { timestamps: true });

export default mongoose.model('EventBooking', eventBookingSchema);
