import mongoose from 'mongoose';

const CollabParticipantSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  collabId: { type: mongoose.Schema.Types.ObjectId, ref: 'Collab', required: true },
  collabName: {type: String, ref: 'Collab', required: true},
  role: { type: String, enum: ['ADMIN', 'MEMBER'], default: 'MEMBER' },
  joinedAt: { type: Date, default: Date.now }
});

export default mongoose.models.CollabParticipant || mongoose.model('CollabParticipant', CollabParticipantSchema);