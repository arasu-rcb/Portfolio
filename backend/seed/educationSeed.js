import Education from "../models/education.js";

export const seedEducation = async () => {
  try {
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
  } catch (error) {
    console.error("Error seeding Education:", error.message);
    throw error;
  }
};
