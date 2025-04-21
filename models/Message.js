import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    content: { type: String, required: true },
    room: { type: String, required: true },
    sender: { type: String, required: true },
    timestamp: {
        type: Date,
        default: Date.now
      },
    profilePic: { 
        type: String, 
        unique: true,
        default: "./public/default-pic.png"
     },
  });
  
  export default mongoose.models.User || mongoose.model('Message', MessageSchema);