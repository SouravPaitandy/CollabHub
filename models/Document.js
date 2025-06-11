import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, default: '' }, // We'll store serialized content here
  collabId: { type: mongoose.Schema.Types.ObjectId, ref: 'Collab', required: true },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastEditedBy: { type: String },
  version: { type: Number, default: 1 },
  isPublic: { type: Boolean, default: false }
});

export default mongoose.models.Document || mongoose.model('Document', DocumentSchema);