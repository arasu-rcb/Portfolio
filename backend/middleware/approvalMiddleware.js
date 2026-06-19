import crypto from "crypto";
import PendingUpdate from "../models/pendingUpdate.js";
import { sendApprovalMail } from "../utils/sendApprovalMail.js";

/**
 * Express middleware to capture and redirect portfolio changes to the pending approval queue
 * @param {string} modelName - The name of the collection being updated ("About" | "Project" | "Skill" | "Experience" | "Education")
 */
export const requestApproval = (modelName) => {
  return async (req, res, next) => {
    try {
      // Determine action type
      const action = req.method === "POST" ? "CREATE" : req.method === "DELETE" ? "DELETE" : "UPDATE";
      
      let finalAction = action;
      // Handle project reordering check
      if (req.url === "/reorder" || req.path === "/reorder") {
        finalAction = "REORDER";
      }

      // Generate verification token
      const token = crypto.randomBytes(32).toString("hex");

      // Extract details if a file was uploaded by multer
      const fileDetails = req.file ? {
        filename: req.file.filename,
        path: `/uploads/${req.file.fieldname === "resume" ? "resume" : "images"}/${req.file.filename}`,
        fieldname: req.file.fieldname
      } : null;

      // Save request parameters into the database pending queue
      const pending = new PendingUpdate({
        modelName,
        action: finalAction,
        targetId: req.params.id || null,
        updateData: req.body || {},
        fileDetails,
        token
      });

      await pending.save();

      // Dispatch verification email to admin
      const emailSent = await sendApprovalMail(pending);
      if (!emailSent) {
        // Drop the pending document if email failed
        await PendingUpdate.deleteOne({ _id: pending._id });
        return res.status(500).json({ message: "Failed to send approval email. Change cancelled." });
      }

      // Respond back to frontend that modification is pending email confirmation
      return res.status(200).json({
        success: true,
        message: "Change submitted for approval. Please check your email to confirm the update."
      });
    } catch (error) {
      console.error("[Approval Middleware Error]:", error.message);
      return res.status(500).json({ message: "Server error setting up modification approval." });
    }
  };
};
