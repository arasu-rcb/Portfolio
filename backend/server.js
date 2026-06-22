import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import nodemailer from "nodemailer";
import connectDB from "./config/db.js";

import contactRoutes from "./routes/contactRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import aboutRoutes from "./routes/aboutRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import experienceRoutes from "./routes/experienceRoutes.js";
import educationRoutes from "./routes/educationRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://arasumurali.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());

// Serve static uploads
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// API Routes
app.use("/api/contact", contactRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/education", educationRoutes);

app.get("/", (req, res) => {
  res.send("Portfolio Backend is Running");
});

app.get("/health", async (req, res) => {
  try {
    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const port = parseInt(process.env.SMTP_PORT || "587", 10);
    const user = process.env.EMAIL_USER || process.env.SMTP_USER;
    const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS;
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;

    if (!user || !pass) {
      return res.status(500).json({
        status: "error",
        message: "Missing SMTP credentials",
        smtp: { host, port, userConfigured: !!user, passConfigured: !!pass },
        adminEmail
      });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      requireTLS: port === 587,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000
    });

    console.log("[Health] Verifying SMTP connection to", host, 'port', port);
    await transporter.verify();
    console.log("[Health] SMTP verification successful");
    
    return res.status(200).json({
      status: "ok",
      resendConfigured: !!process.env.RESEND_API_KEY,
      message: "SMTP connection successful",
      smtp: { host, port, secure: port === 465, requireTLS: port === 587 },
      adminEmail
    });
  } catch (error) {
    console.error("[Health] SMTP verification failed:", error.message);
    console.error("[Health] Error code:", error.code);
    return res.status(200).json({
      status: "error",
      resendConfigured: !!process.env.RESEND_API_KEY,
      message: "SMTP verification failed",
      error: error.message,
      code: error.code
    });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
