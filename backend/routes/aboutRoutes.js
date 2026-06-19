import express from "express";
import { 
  getAbout, 
  updateAbout,
  updateProfileImage,
  updateResume
} from "../controllers/aboutController.js";
import protect from "../middleware/authMiddleware.js";
import { imageUpload, resumeUpload } from "../middleware/uploadMiddleware.js";
import { requestApproval } from "../middleware/approvalMiddleware.js";

const router = express.Router();

router.get("/", getAbout);
router.put("/", protect, requestApproval("About"), updateAbout);
router.put("/profile-image", protect, imageUpload.single("profileImage"), requestApproval("About"), updateProfileImage);
router.put("/resume", protect, resumeUpload.single("resume"), requestApproval("About"), updateResume);

export default router;
