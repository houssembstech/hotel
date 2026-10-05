import mongoose, { Document, Schema } from 'mongoose';

export interface IHotel extends Document {
  name: string;
  email: string;
  phone: string;
  address: string;
  currency: string;
  timezone: string;
  taxRate: number;
  limits: {
    maxRooms: number;
  };
  isActive: boolean;
  createdAt: Date;
}

const HotelSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  currency: { type: String, default: 'USD' },
  timezone: { type: String, default: 'UTC' },
  taxRate: { type: Number, default: 0 },
  limits: {
    maxRooms: { type: Number, default: 50 }
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IHotel>('Hotel', HotelSchema);
