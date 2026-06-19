import express from "express";
import {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill
} from "../controllers/skillController.js";
import protect from "../middleware/authMiddleware.js";
import { requestApproval } from "../middleware/approvalMiddleware.js";

const router = express.Router();

router.get("/", getSkills);
router.post("/", protect, requestApproval("Skill"), createSkill);
router.put("/:id", protect, requestApproval("Skill"), updateSkill);
router.delete("/:id", protect, requestApproval("Skill"), deleteSkill);

export default router;
