import mongoose from "mongoose";

const pendingUpdateSchema = new mongoose.Schema(
  {
    modelName: {
      type: String,
      required: true // "About" | "Project" | "Skill" | "Experience" | "Education"
    },
    action: {
      type: String,
      required: true // "CREATE" | "UPDATE" | "DELETE" | "REORDER"
    },
    targetId: {
      type: String,
      default: null // The ID of the document being edited or deleted
    },
    updateData: {
      type: mongoose.Schema.Types.Mixed,
      default: {} // Default to empty object if no request body is present (e.g., DELETE actions)
    },
    fileDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: null // Filename and storage path if a profile photo, resume, or certificate was uploaded
    },
    token: {
      type: String,
      required: true,
      unique: true // Cryptographically secure random token generated to validate email links
    }
  },
  { timestamps: true }
);

export default mongoose.model("PendingUpdate", pendingUpdateSchema);
