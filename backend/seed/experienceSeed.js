import Experience from "../models/experience.js";

export const seedExperience = async () => {
  try {
    const experienceCount = await Experience.countDocuments();
    if (experienceCount === 0) {
      const defaultExperience = [
        {
          company: "Teachnook",
          role: "Cyber Security",
          duration: "November 2022 – December 2022",
          description: "Gained foundational experience in cyber threat intelligence and network behaviors.",
          type: "Remote",
          certificateUrl: "/uploads/resume/Teachnook.pdf"
        },
        {
          company: "VCodesz Innovated Ideas, Chennai",
          role: "Java Full Stack Development",
          duration: "April 2025 – June 2025",
          description: "Developed and built full-stack web platforms using Java core technologies.",
          type: "On-Site",
          certificateUrl: "/uploads/resume/Vcodez.pdf"
        },
        {
          company: "CodeTech IT Solutions, Telangana",
          role: "MERN Stack Development",
          duration: "September 2025 – December 2025",
          description: "Constructed responsive layouts and secure database interfaces using the MERN stack.",
          type: "Remote",
          certificateUrl: "/uploads/resume/CodeTech.pdf"
        }
      ];
      await Experience.insertMany(defaultExperience);
      console.log("Experiences list seeded successfully.");
    } else {
      console.log("Experiences database is already populated.");
    }
  } catch (error) {
    console.error("Error seeding Experience:", error.message);
    throw error;
  }
};
