import mongoose from "mongoose";

// Define the schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  images: { type: [String], default: [] },
});

export default mongoose.model("User", userSchema);
