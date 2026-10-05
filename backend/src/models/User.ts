import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  phone: { type: String },
  role: { 
    type: String, 
    enum: ['SUPER_ADMIN', 'DIRECTOR', 'RECEPTIONIST', 'GUEST'],
    default: 'GUEST'
  },
  identityDocumentUrl: { type: String },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
