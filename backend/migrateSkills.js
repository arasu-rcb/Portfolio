import mongoose from "mongoose";
import dotenv from "dotenv";
import Skill from "./models/skill.js";

dotenv.config();

const iconMapping = {
  "Network Protocols": "FaNetworkWired",
  "Routing & Switching": "FaServer",
  "Hardware Assembly": "FaMicrochip",
  "Troubleshooting": "FaTools",
  "Cyber Security (Basics)": "FaShieldAlt",
  "Cyber Security": "FaShieldAlt",
  "HTML": "FaHtml5",
  "CSS": "FaCss3Alt",
  "React.js": "FaReact",
  "Tailwind CSS": "SiTailwindcss",
  "Node.js": "FaNodeJs",
  "MongoDB": "SiMongodb",
  "MySQL": "SiMysql",
  "Python": "FaPython",
  "Java": "FaJava",
  "GitHub": "FaGithub",
  "Vercel": "SiVercel",
  "Netlify": "SiNetlify"
};

const migrate = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error("Error: MONGO_URI not found in environment variables.");
      process.exit(1);
    }

    console.log("Connecting to database for migration...");
    await mongoose.connect(mongoUri);
    console.log("Database connected.");

    const skills = await Skill.find();
    console.log(`Found ${skills.length} skills in database.`);

    let updatedCount = 0;
    for (const skill of skills) {
      const matchedIcon = iconMapping[skill.name] || "FaTools";
      
      // Update the database document
      skill.icon = matchedIcon;
      await skill.save();
      console.log(`Updated skill "${skill.name}" with icon "${matchedIcon}"`);
      updatedCount++;
    }

    console.log(`Migration completed successfully! Updated ${updatedCount} skills. ✅`);
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error.message);
    process.exit(1);
  }
};

migrate();
