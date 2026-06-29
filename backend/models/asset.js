import mongoose from "mongoose";

const assetSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    contentType: {
      type: String,
      required: true
    },
    data: {
      type: Buffer,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Asset", assetSchema);
