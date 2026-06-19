import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

import Admin from "./models/admin.js";
import About from "./models/about.js";
import Skill from "./models/skill.js";
import Experience from "./models/experience.js";
import Education from "./models/education.js";
import Project from "./models/project.js";

dotenv.config();

// Helper to copy local image assets from frontend to backend uploads
const copyAsset = (srcName, destName) => {
  try {
    const srcPath = path.join(process.cwd(), "../frontend/src/assets", srcName);
    const destPath = path.join(process.cwd(), "uploads/images", destName);
    
    // Ensure destination directory exists
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`[Asset Copier] Copied ${srcName} -> ${destName}`);
    } else {
      console.warn(`[Asset Copier] Source asset not found: ${srcPath}`);
    }
  } catch (err) {
    console.warn(`[Asset Copier] Could not copy asset ${srcName}:`, err.message);
  }
};

const seed = async () => {
  try {
    console.log("Connecting to database for seeding...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected.");

    // Copy local assets
    copyAsset("train.jpg", "train.jpg");
    copyAsset("voting-system.jpg", "voting-system.jpg");
    copyAsset("to-do.jpg", "to-do.jpg");
    copyAsset("alert-sys-DjsmfJeV.jpg", "alert-sys.jpg"); // check versioned or non-versioned alert-sys
    copyAsset("alert-sys.jpg", "alert-sys.jpg");
    copyAsset("cyber.jpg", "cyber.jpg");
    copyAsset("trucars.jpg", "trucars.jpg");
    copyAsset("profile.png", "profile.png");

    // 1. Seed Admin
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

    // 2. Seed About
    const aboutExists = await About.findOne();
    if (!aboutExists) {
      const defaultAbout = new About({
        name: "Arasu Murali",
        title: "Computer Science Engineer",
        description: "I am a passionate and goal-oriented Computer Science and Engineering graduate with a specialization in Cyber Security from Bharath Institute of Higher Education and Research.\n\nMy primary areas of interest and expertise include Networking, Hardware, and Cyber Security, with a strong foundation in Web Development. I am proficient in programming languages and technologies such as Python, Java, SQL, Git, and GitHub. I am committed to continuously enhancing my technical skills and aspire to build a successful career in the fields of Networking and Cyber Security while contributing to innovative and secure technology solutions.",
        email: "arasumurali014@gmail.com",
        phone: "8608166921",
        location: "Chennai, India",
        github: "https://github.com/arasu-rcb",
        linkedin: "https://www.linkedin.com/in/arasu-murali/"
      });
      await defaultAbout.save();
      console.log("About details seeded successfully.");
    } else {
      console.log("About details already exist.");
    }

    // 3. Seed Skills
    const skillsCount = await Skill.countDocuments();
    if (skillsCount === 0) {
      const defaultSkills = [
        // Hardware & Networking
        { name: "Network Protocols", percentage: 85, category: "Hardware & Networking" },
        { name: "Routing & Switching", percentage: 80, category: "Hardware & Networking" },
        { name: "Hardware Assembly", percentage: 75, category: "Hardware & Networking" },
        { name: "Troubleshooting", percentage: 90, category: "Hardware & Networking" },
        { name: "Cyber Security", percentage: 85, category: "Hardware & Networking" },
        // Web Development
        { name: "HTML", percentage: 95, category: "Web Development" },
        { name: "CSS", percentage: 90, category: "Web Development" },
        { name: "React.js", percentage: 80, category: "Web Development" },
        { name: "Tailwind CSS", percentage: 85, category: "Web Development" },
        { name: "Node.js", percentage: 75, category: "Web Development" },
        { name: "MongoDB", percentage: 75, category: "Web Development" },
        { name: "MySQL", percentage: 80, category: "Web Development" },
        // Programming Languages
        { name: "Python", percentage: 80, category: "Programming Languages" },
        { name: "Java", percentage: 75, category: "Programming Languages" },
        // Tools
        { name: "GitHub", percentage: 85, category: "Tools" },
        { name: "Vercel", percentage: 80, category: "Tools" },
        { name: "Netlify", percentage: 80, category: "Tools" }
      ];
      await Skill.insertMany(defaultSkills);
      console.log("Skills list seeded successfully.");
    } else {
      console.log("Skills database is already populated.");
    }

    // 4. Seed Experience
    const experienceCount = await Experience.countDocuments();
    if (experienceCount === 0) {
      const defaultExperience = [
        {
          company: "Teachnook",
          role: "Cyber Security",
          duration: "November 2022 – December 2022",
          description: "Gained foundational experience in cyber threat intelligence and network behaviors.",
          type: "Remote",
          certificateUrl: ""
        },
        {
          company: "VCodesz Innovated Ideas, Chennai",
          role: "Java Full Stack Development",
          duration: "April 2025 – June 2025",
          description: "Developed and built full-stack web platforms using Java core technologies.",
          type: "On-Site",
          certificateUrl: ""
        },
        {
          company: "CodeTech IT Solutions, Telangana",
          role: "MERN Stack Development",
          duration: "September 2025 – December 2025",
          description: "Constructed responsive layouts and secure database interfaces using the MERN stack.",
          type: "Remote",
          certificateUrl: ""
        }
      ];
      await Experience.insertMany(defaultExperience);
      console.log("Experiences list seeded successfully.");
    } else {
      console.log("Experiences database is already populated.");
    }

    // 5. Seed Education
    const educationCount = await Education.countDocuments();
    if (educationCount === 0) {
      const defaultEducation = [
        {
          degree: "Higher Secondary Education",
          institution: "Vivekanandha Matriculation Higher Secondary School, Sayanapuram",
          year: "2021 – 2022",
          cgpa: "Percentage: 73.1%"
        },
        {
          degree: "B.Tech – Cyber Security",
          institution: "Bharath Institute of Higher Education and Research, Selaiyur",
          year: "2022 – 2026",
          cgpa: "CGPA: 8.0"
        }
      ];
      await Education.insertMany(defaultEducation);
      console.log("Education timeline seeded successfully.");
    } else {
      console.log("Education database is already populated.");
    }

    // 6. Seed Projects
    const projectsCount = await Project.countDocuments();
    if (projectsCount === 0) {
      const defaultProjects = [
        {
          title: "Detection Of Cyber Attacks In Industrial Control Systems Using Artificial Neural Networks",
          description: "Focuses on detecting water-bed cyber-attacks using Artificial Neural Networks (ANNs). The system uses machine learning to learn normal and abnormal network behavior from datasets to identify attacks effectively. Data preprocessing, feature extraction, training, and model evaluation are utilized to improve classification efficiency and cybersecurity protection.",
          image: "/uploads/images/cyber.jpg",
          github: "https://github.com/arasu-rcb/DETECTION-OF-CYBER-ATTACKS-IN-INDUSTRIAL-CONTROL-SYSTEMS-USING-ANN",
          techStack: ["Python", "TensorFlow", "Keras", "Pandas"],
          liveLink: ""
        },
        {
          title: "Dynamic Train Ticket Reservation System",
          description: "A digital booking platform featuring automated ticketing pipelines. Leverages dynamic seat pricing, real-time ticket availability queries, seat allocation logic, and automated booking receipts.",
          image: "/uploads/images/train.jpg",
          github: "https://github.com/harishankar177/Dynamic-ticket-reservation-system",
          techStack: ["React.js", "Node.js", "Express.js", "MongoDB", "Tailwind CSS"],
          liveLink: ""
        },
        {
          title: "Online Voting System",
          description: "A secured online polling portal designed to run authenticated democratic elections. Integrates robust voter verification controls, single-vote locking mechanisms, and real-time live result tallies.",
          image: "/uploads/images/voting-system.jpg",
          github: "https://github.com/arasu-rcb/Online-Voting-System",
          techStack: ["HTML5", "CSS3", "JavaScript", "PHP", "MySQL"],
          liveLink: ""
        },
        {
          title: "Todo App",
          description: "A clean, functional task manager for daily work scheduling. Supports task CRUD operations, deadline alerts, customizable category filters, and persistent localStorage data retention.",
          image: "/uploads/images/to-do.jpg",
          github: "https://github.com/arasu-rcb/To-Do",
          techStack: ["React.js", "Tailwind CSS", "JavaScript"],
          liveLink: ""
        },
        {
          title: "Smart Alert System",
          description: "A computer-vision safety system designed to detect drowsiness or physical obstruction. Analyzes live video streams using OpenCV to monitor facial landmarks and gives an alert warning if the user closes their eyes or if their face is obstructed.",
          image: "/uploads/images/alert-sys.jpg",
          github: "https://github.com/arasu-rcb/SmartAlertSystem",
          techStack: ["Python", "Machine Learning", "Pygame", "Tkinter", "OpenCV"],
          liveLink: ""
        },
        {
          title: "TruCars",
          description: "A full-featured automotive dealership and rental hub. Includes advanced vehicle searching/filtering, automated reservation workflows, pricing models, and user feedback systems.",
          image: "/uploads/images/trucars.jpg",
          github: "https://github.com/arasu-rcb/TruCars",
          techStack: ["React.js", "Node.js", "Express.js", "MongoDB", "Tailwind CSS"],
          liveLink: ""
        }
      ];
      await Project.insertMany(defaultProjects);
      console.log("Projects seeded successfully.");
    } else {
      console.log("Projects database is already populated.");
    }

    console.log("Database seeding completed successfully! ✅");
    process.exit(0);
  } catch (error) {
    console.error("Database seeding failed:", error.message);
    process.exit(1);
  }
};

seed();
