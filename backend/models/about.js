import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    github: {
      type: String,
      required: true
    },
    linkedin: {
      type: String,
      required: true
    },
    profileImage: {
      type: String,
      default: ""
    },
    resumeUrl: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

export default mongoose.model("About", aboutSchema);
