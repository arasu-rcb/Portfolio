import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

import Admin from "../models/admin.js";
import { seedAbout } from "./aboutSeed.js";
import { seedProjects } from "./projectSeed.js";
import { seedSkills } from "./skillSeed.js";
import { seedExperience } from "./experienceSeed.js";
import { seedEducation } from "./educationSeed.js";

dotenv.config();

// Helper to copy local assets from frontend to backend uploads
const copyAsset = (srcName, destFolder, destName) => {
  try {
    const srcPath = path.join(process.cwd(), "../frontend/src/assets", srcName);
    const destPath = path.join(process.cwd(), destFolder, destName);
    
    // Ensure destination directory exists
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`[Asset Copier] Copied ${srcName} -> ${destFolder}/${destName}`);
    } else {
      console.warn(`[Asset Copier] Source asset not found: ${srcPath}`);
    }
  } catch (err) {
    console.warn(`[Asset Copier] Could not copy asset ${srcName}:`, err.message);
  }
};

const runSeed = async () => {
  try {
    console.log("Connecting to database for modular seeding...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected.");

    // 1. Copy assets
    console.log("Copying asset files from frontend...");
    copyAsset("profile.png", "uploads/images", "profile.png");
    copyAsset("cyber.jpg", "uploads/images", "cyber.jpg");
    copyAsset("train.jpg", "uploads/images", "train.jpg");
    copyAsset("voting-system.jpg", "uploads/images", "voting-system.jpg");
    copyAsset("to-do.jpg", "uploads/images", "to-do.jpg");
    copyAsset("alert-sys.jpg", "uploads/images", "alert-sys.jpg");
    copyAsset("trucars.jpg", "uploads/images", "trucars.jpg");

    // Copy PDF certificates and main resume
    copyAsset("Teachnook.pdf", "uploads/resume", "Teachnook.pdf");
    copyAsset("Vcodez.pdf", "uploads/resume", "Vcodez.pdf");
    copyAsset("CodeTech.pdf", "uploads/resume", "CodeTech.pdf");
    copyAsset("Arasu Murali Updated Resume.pdf", "uploads/resume", "resume.pdf");

    // 2. Seed Admin user if none exists
    const adminExists = await Admin.findOne();
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("admin123", salt);
      const defaultAdmin = new Admin({
        username: "admin",
        email: "admin@portfolio.com",
        password: hashedPassword,
      });
      await defaultAdmin.save();
      console.log("Admin account seeded successfully.");
    } else {
      console.log("Admin account already exists.");
    }

    // 3. Run all modular seeders
    await seedAbout();
    await seedProjects();
    await seedSkills();
    await seedExperience();
    await seedEducation();

    console.log("Modular Database seeding completed successfully! ✅");
    process.exit(0);
  } catch (error) {
    console.error("Modular Database seeding failed:", error.message);
    process.exit(1);
  }
};

runSeed();
