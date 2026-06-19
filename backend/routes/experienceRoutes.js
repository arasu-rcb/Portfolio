import express from "express";
import {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience
} from "../controllers/experienceController.js";
import protect from "../middleware/authMiddleware.js";
import { resumeUpload } from "../middleware/uploadMiddleware.js";
import { requestApproval } from "../middleware/approvalMiddleware.js";

const router = express.Router();

router.get("/", getExperiences);
router.post("/", protect, resumeUpload.single("certificate"), requestApproval("Experience"), createExperience);
router.put("/:id", protect, resumeUpload.single("certificate"), requestApproval("Experience"), updateExperience);
router.delete("/:id", protect, requestApproval("Experience"), deleteExperience);

export default router;
