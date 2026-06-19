import express from "express";
import { 
  saveMessage, 
  getMessages, 
  deleteMessage 
} from "../controllers/contactControllers.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", saveMessage);
router.get("/", protect, getMessages);
router.delete("/:id", protect, deleteMessage);

export default router;
