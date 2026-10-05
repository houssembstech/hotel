import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  amount: { type: Number, required: true },
  method: { 
    type: String, 
    enum: ['CARD', 'CASH', 'TRANSFER'], 
    required: true 
  },
  transactionRef: { type: String },
  status: { 
    type: String, 
    enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'],
    default: 'PENDING'
  },
  paidAt: { type: Date }
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);
