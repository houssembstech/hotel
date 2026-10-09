import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  idNumber: { type: String, unique: true, sparse: true }, // Passport, CIN, etc.
  passwordHash: { type: String, required: true },
  needsPasswordChange: { type: Boolean, default: false },
  phone: { type: String },
  role: { 
    type: String, 
    enum: ['SUPER_ADMIN', 'DIRECTOR', 'RECEPTIONIST', 'GUEST'],
    default: 'GUEST'
  },
  identityDocumentUrl: { type: String },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
