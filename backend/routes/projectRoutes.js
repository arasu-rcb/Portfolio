import express from "express";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects
} from "../controllers/projectController.js";
import protect from "../middleware/authMiddleware.js";
import { imageUpload } from "../middleware/uploadMiddleware.js";
import { requestApproval } from "../middleware/approvalMiddleware.js";

const router = express.Router();

router.get("/", getProjects);
router.post("/", protect, imageUpload.single("image"), requestApproval("Project"), createProject);
router.put("/reorder", protect, requestApproval("Project"), reorderProjects);
router.put("/:id", protect, imageUpload.single("image"), requestApproval("Project"), updateProject);
router.delete("/:id", protect, requestApproval("Project"), deleteProject);

export default router;