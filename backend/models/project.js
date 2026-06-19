import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    github: {
      type: String,
      required: true
    },
    techStack: {
      type: [String],
      required: true
    },
    liveLink: {
      type: String,
      default: ""
    },
    order: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
