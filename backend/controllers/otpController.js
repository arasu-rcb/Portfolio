import Otp from "../models/otp.js";
import Admin from "../models/admin.js";
import jwt from "jsonwebtoken";
import { generateOtp } from "../utils/generateOtp.js";
import { sendOtpMail } from "../utils/sendOtpMail.js";

// Generate JWT token helper (consistent with adminController.js)
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

/**
 * POST /api/admin/verify-otp
 * Verifies the submitted OTP code and issues a JWT token if valid
 */
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    // Find the latest OTP record for this email
    const otpRecord = await Otp.findOne({ email: email.toLowerCase() }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: "OTP Expired" });
    }

    // Check expiration
    if (new Date() > new Date(otpRecord.expiresAt)) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ success: false, message: "OTP Expired" });
    }

    // Check if the OTP is correct
    if (otpRecord.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // OTP is valid - delete the record so it cannot be reused
    await Otp.deleteOne({ _id: otpRecord._id });

    // Generate JWT token
    const token = generateToken(admin._id);

    return res.status(200).json({
      success: true,
      token,
      admin: {
        _id: admin._id,
        username: admin.username,
        email: admin.email
      }
    });
  } catch (error) {
    console.error("[OTP Controller] Verification error:", error.message);
    res.status(500).json({ success: false, message: "Server error during OTP verification" });
  }
};

/**
 * POST /api/admin/resend-otp
 * Generates and sends a new OTP with a 60-second rate-limiting guard
 */
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    // Check rate limit: find existing OTP record to verify time elapsed
    const existingRecord = await Otp.findOne({ email: email.toLowerCase() }).sort({ createdAt: -1 });
    if (existingRecord) {
      const timeElapsed = (Date.now() - new Date(existingRecord.createdAt).getTime()) / 1000;
      const cooldown = 60; // 60 seconds limit
      if (timeElapsed < cooldown) {
        const remaining = Math.ceil(cooldown - timeElapsed);
        return res.status(429).json({
          success: false,
          message: `Please wait ${remaining} seconds before requesting a new OTP.`
        });
      }
      // Delete older OTP records for this email
      await Otp.deleteMany({ email: email.toLowerCase() });
    }

    // Generate and store new OTP
    const newOtpCode = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration

    const otpDocument = new Otp({
      email: email.toLowerCase(),
      otp: newOtpCode,
      expiresAt
    });
    await otpDocument.save();

    // Send via email
    const mailSent = await sendOtpMail(admin.email, newOtpCode);
    if (!mailSent) {
      return res.status(500).json({ success: false, message: "Failed to send OTP email" });
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully"
    });
  } catch (error) {
    console.error("[OTP Controller] Resend error:", error.message);
    res.status(500).json({ success: false, message: "Server error during OTP resend" });
  }
};
