import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    category: {
      type: String,
      required: true,
      default: "Web Development" // Optional grouping helper matching frontend categories
    }
  },
  { timestamps: true }
);

export default mongoose.model("Skill", skillSchema);
