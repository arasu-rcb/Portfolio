import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    otp: {
      type: String,
      required: true
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 } // Auto-deletes document when expiresAt time is reached
    }
  },
  { timestamps: true }
);

export default mongoose.model("Otp", otpSchema);
