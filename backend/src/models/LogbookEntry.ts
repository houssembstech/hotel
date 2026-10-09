import mongoose from 'mongoose';

const logbookEntrySchema = new mongoose.Schema({
  authorName: { type: String, required: true },
  content: { type: String, required: true },
  roomNumber: { type: String }, // Optional, if the note concerns a specific room
  priority: { type: String, enum: ['NORMAL', 'URGENT'], default: 'NORMAL' },
  isResolved: { type: Boolean, default: false },
  resolvedBy: { type: String }
}, { timestamps: true });

export default mongoose.model('LogbookEntry', logbookEntrySchema);
