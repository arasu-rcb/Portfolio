import Admin from "../models/admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Otp from "../models/otp.js";
import { generateOtp } from "../utils/generateOtp.js";
import { sendOtpMail } from "../utils/sendOtpMail.js";

// Generate JWT token helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Admin Login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (admin && (await bcrypt.compare(password, admin.password))) {
      // Clear any existing OTPs for this email to prevent duplicate or conflicting records
      await Otp.deleteMany({ email: admin.email });

      // Generate a new 6-digit OTP code
      const otpCode = generateOtp();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration

      // Save the OTP temporarily in MongoDB
      const otpDocument = new Otp({
        email: admin.email,
        otp: otpCode,
        expiresAt
      });
      await otpDocument.save();

      // Send the OTP email to the administrator
      const recipient = process.env.ADMIN_EMAIL || admin.email;
      const mailResult = await sendOtpMail(recipient, otpCode);
      if (!mailResult.success) {
        console.error("[Admin Controller] sendOtpMail failed:", mailResult.message);
        return res.status(500).json({ message: `Failed to send OTP email: ${mailResult.message}` });
      }

      return res.status(200).json({
        success: true,
        message: "OTP sent successfully"
      });
    } else {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Seeding tool for first admin (runs only if database has 0 admins)
export const seedAdmin = async (req, res) => {
  try {
    const adminExists = await Admin.findOne();

    if (adminExists) {
      return res.status(400).json({ message: "Admin account already exists" });
    }

    // Hash default password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("Arasu@1406", salt);

    const defaultAdmin = new Admin({
      username: "admin",
      email: "arasumurali014@gmail.com",
      password: hashedPassword,
    });

    await defaultAdmin.save();
    return res.status(201).json({
      message: "Default admin account seeded successfully",
      credentials: {
        email: "arasumurali014@gmail.com",
        password: "Arasu@1406"
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
