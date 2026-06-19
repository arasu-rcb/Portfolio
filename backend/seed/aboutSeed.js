import About from "../models/about.js";

export const seedAbout = async () => {
  try {
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
        linkedin: "https://www.linkedin.com/in/arasu-murali/",
        profileImage: "/uploads/images/profile.png",
        resumeUrl: "/uploads/resume/resume.pdf"
      });
      await defaultAbout.save();
      console.log("About details seeded successfully.");
    } else {
      console.log("About details already exist.");
    }
  } catch (error) {
    console.error("Error seeding About:", error.message);
    throw error;
  }
};
