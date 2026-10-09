import mongoose from 'mongoose';

const hotelPolicySchema = new mongoose.Schema({
  hotelId: { type: String, required: true, unique: true },
  cityTax: { type: Number, default: 2.50 }, // per night, per person
  earlyCheckInFee: { type: Number, default: 50 },
  lateCheckOutFee: { type: Number, default: 50 },
  cancellationPercentage: { type: Number, default: 30 } // % retained if cancelled late
}, { timestamps: true });

export default mongoose.model('HotelPolicy', hotelPolicySchema);
