import mongoose from 'mongoose';

const CollabSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  inviteCode: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: String, required: true },
  // Add GitHub specific fields
  githubRepoId: { type: String },
  githubRepoUrl: { type: String }
});

export default mongoose.models.Collab || mongoose.model('Collab', CollabSchema);