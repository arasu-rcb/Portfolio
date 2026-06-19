import express from "express";
import {
  getEducation,
  createEducation,
  updateEducation,
  deleteEducation
} from "../controllers/educationController.js";
import protect from "../middleware/authMiddleware.js";
import { requestApproval } from "../middleware/approvalMiddleware.js";

const router = express.Router();

router.get("/", getEducation);
router.post("/", protect, requestApproval("Education"), createEducation);
router.put("/:id", protect, requestApproval("Education"), updateEducation);
router.delete("/:id", protect, requestApproval("Education"), deleteEducation);

export default router;
