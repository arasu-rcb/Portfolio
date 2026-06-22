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

      const backendUrl = process.env.BACKEND_URL || "https://arasuportfolio.onrender.com";
      console.log(`[APPROVAL] Proposing update for ${modelName} (${finalAction}).`);
      console.log(`[APPROVAL] Approve URL: ${backendUrl}/api/admin/approve-update?token=${token}`);
      console.log(`[APPROVAL] Reject URL: ${backendUrl}/api/admin/reject-update?token=${token}`);

      // Dispatch verification email to admin in the background
      sendApprovalMail(pending).then((success) => {
        if (!success) {
          console.warn("[Approval Middleware] background sendApprovalMail failed.");
        }
      }).catch((err) => {
        console.warn("[Approval Middleware] background sendApprovalMail error:", err.message);
      });

      // Respond back to frontend that modification is pending approval (either via email or log url)
      return res.status(200).json({
        success: true,
        message: "Change submitted for approval. Please check your email or server logs to confirm the update."
      });
    } catch (error) {
      console.error("[Approval Middleware Error]:", error.message);
      return res.status(500).json({ message: "Server error setting up modification approval." });
    }
  };
};
