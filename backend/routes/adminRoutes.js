import express from "express";
import { loginAdmin, seedAdmin } from "../controllers/adminController.js";
import { verifyOtp, resendOtp, requestPasswordReset, resetPassword } from "../controllers/otpController.js";
import { approveUpdate, rejectUpdate } from "../controllers/approvalController.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/seed", seedAdmin);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

// Email update approval links
router.get("/approve-update", approveUpdate);
router.get("/reject-update", rejectUpdate);

export default router;
