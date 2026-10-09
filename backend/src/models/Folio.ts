import mongoose from 'mongoose';

const folioItemSchema = new mongoose.Schema({
  label: { type: String, required: true },
  category: { type: String, required: true }, // 'ROOM', 'DINING', 'SPA', etc.
  amount: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  date: { type: Date, default: Date.now }
});

const paymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  method: { type: String, enum: ['CASH', 'CARD', 'BANK_TRANSFER'], required: true },
  agentName: { type: String },
  shiftId: { type: String },
  date: { type: Date, default: Date.now }
});

const folioSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  guestName: { type: String, required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  items: [folioItemSchema],
  payments: [paymentSchema],
  isClosed: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Folio', folioSchema);
