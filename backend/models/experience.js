import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true
    },
    duration: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      required: true,
      default: "Remote" // e.g. On-Site, Remote, Hybrid
    },
    certificateUrl: {
      type: String,
      default: "" // Path to the uploaded PDF certificate if any
    }
  },
  { timestamps: true }
);

export default mongoose.model("Experience", experienceSchema);
