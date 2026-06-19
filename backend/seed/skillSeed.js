import Skill from "../models/skill.js";

export const seedSkills = async () => {
  try {
    const skillsCount = await Skill.countDocuments();
    if (skillsCount === 0) {
      const defaultSkills = [
        // Hardware & Networking
        { name: "Network Protocols", percentage: 85, category: "Hardware & Networking" },
        { name: "Routing & Switching", percentage: 80, category: "Hardware & Networking" },
        { name: "Hardware Assembly", percentage: 75, category: "Hardware & Networking" },
        { name: "Troubleshooting", percentage: 90, category: "Hardware & Networking" },
        { name: "Cyber Security (Basics)", percentage: 85, category: "Hardware & Networking" },
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
  } catch (error) {
    console.error("Error seeding Skills:", error.message);
    throw error;
  }
};
