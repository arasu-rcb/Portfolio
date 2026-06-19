import express from "express";
import { loginAdmin, seedAdmin } from "../controllers/adminController.js";
import { verifyOtp, resendOtp } from "../controllers/otpController.js";
import { approveUpdate, rejectUpdate } from "../controllers/approvalController.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/seed", seedAdmin);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

// Email update approval links
router.get("/approve-update", approveUpdate);
router.get("/reject-update", rejectUpdate);

export default router;
