import mongoose from 'mongoose';

const shiftSessionSchema = new mongoose.Schema({
  agentName: { type: String, required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  initialCashFloat: { type: Number, required: true }, // Fond de caisse
  currentCashTotal: { type: Number, required: true },
  actualCashCount: { type: Number, default: 0 },
  closingSignature: { type: String },
  status: { type: String, enum: ['OPEN', 'CLOSED'], default: 'OPEN' }
}, { timestamps: true });

export default mongoose.model('ShiftSession', shiftSessionSchema);
