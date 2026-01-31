import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String },
  username: { type: String, unique: true },

  // Auth & Linking
  accounts: [
    {
      provider: String,
      providerId: String,
      _id: false,
    },
  ],

  // Rich Profile (Optional)
  bio: { type: String, default: "" },
  skills: { type: [String], default: [] },
  location: { type: String, default: "" },
  website: { type: String, default: "" },
  socials: {
    twitter: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    github: { type: String, default: "" },
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
