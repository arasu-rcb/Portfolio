import Project from "../models/project.js";

export const seedProjects = async () => {
  try {
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
      const projectsWithOrder = defaultProjects.map((p, idx) => ({
        ...p,
        order: idx
      }));
      await Project.insertMany(projectsWithOrder);
      console.log("Projects seeded successfully.");
    } else {
      console.log("Projects database is already populated.");
    }
  } catch (error) {
    console.error("Error seeding Projects:", error.message);
    throw error;
  }
};
