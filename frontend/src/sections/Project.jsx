import React, { useEffect, useRef, useState } from "react";
import { FaProjectDiagram, FaGithub } from "react-icons/fa";
import dtrImg from "../assets/train.jpg";
import votingImg from "../assets/voting-system.jpg";
import todoImg from "../assets/to-do.jpg";
import alertImg from "../assets/alert-sys.jpg";
import cyber from "../assets/cyber.jpg";
import trucars from "../assets/trucars.jpg";
const staticProjects = [
  {
    title:
      "Detection Of Cyber Attacks In Industrial Control Systems Using Artificial Neural Networks",
    description: "Focuses on detecting water-bed cyber-attacks using Artificial Neural Networks (ANNs). The system uses machine learning to learn normal and abnormal network behavior from datasets to identify attacks effectively. Data preprocessing, feature extraction, training, and model evaluation are utilized to improve classification efficiency and cybersecurity protection.",
    image: cyber,
    github: "https://github.com/arasu-rcb/DETECTION-OF-CYBER-ATTACKS-IN-INDUSTRIAL-CONTROL-SYSTEMS-USING-ANN",
    techStack: ["Python", "TensorFlow", "Keras", "Pandas"],
  },
  {
    title: "Dynamic Train Ticket Reservation System",
    description: "A digital booking platform featuring automated ticketing pipelines. Leverages dynamic seat pricing, real-time ticket availability queries, seat allocation logic, and automated booking receipts.",
    image: dtrImg,
    github: "https://github.com/harishankar177/Dynamic-ticket-reservation-system",
    techStack: ["React.js", "Node.js", "Express.js", "MongoDB", "Tailwind CSS"],
  },
  {
    title: "Online Voting System",
    description: "A secured online polling portal designed to run authenticated democratic elections. Integrates robust voter verification controls, single-vote locking mechanisms, and real-time live result tallies.",
    image: votingImg,
    github: "https://github.com/arasu-rcb/Online-Voting-System",
    techStack: ["HTML5", "CSS3", "JavaScript", "PHP", "MySQL"],
  },
  {
    title: "Todo App",
    description: "A clean, functional task manager for daily work scheduling. Supports task CRUD operations, deadline alerts, customizable category filters, and persistent localStorage data retention.",
    image: todoImg,
    github: "https://github.com/arasu-rcb/To-Do",
    techStack: ["React.js", "Tailwind CSS", "JavaScript"],
  },
  {
    title: "Smart Alert System",
    description: "A computer-vision safety system designed to detect drowsiness or physical obstruction. Analyzes live video streams using OpenCV to monitor facial landmarks and gives an alert warning if the user closes their eyes or if their face is obstructed.",
    image: alertImg,
    github: "https://github.com/arasu-rcb/SmartAlertSystem",
    techStack: ["Python", "Machine Learning", "Pygame", "Tkinter", "OpenCV"],
  },
  {
    title: "TruCars",
    description: "A full-featured automotive dealership and rental hub. Includes advanced vehicle searching/filtering, automated reservation workflows, pricing models, and user feedback systems.",
    image: trucars,
    github: "https://github.com/arasu-rcb/TruCars",
    techStack: ["React.js", "Node.js", "Express.js", "MongoDB", "Tailwind CSS"],
  },
];

const Project = () => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [projectList, setProjectList] = useState([]);

  useEffect(() => {
    // Fetch dynamic projects
    fetch("http://localhost:5001/api/projects")
      .then((res) => {
        if (!res.ok) throw new Error("API not active");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((p) => ({
            ...p,
            image: p.image ? `http://localhost:5001${p.image}` : "",
          }));
          setProjectList(mapped);
        } else {
          setProjectList(staticProjects);
        }
      })
      .catch(() => {
        console.log("Using static Projects fallback data.");
        setProjectList(staticProjects);
      });
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="w-full bg-gray-900 dark:bg-gray-200 text-gray-300 dark:text-gray-800 py-20 px-6 scroll-mt-24"
    >
      <div className="max-w-6xl mx-auto">

        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
        >
          <h3 className="text-3xl font-bold text-white dark:text-gray-900 flex items-center justify-center gap-3">
            <FaProjectDiagram className="text-white dark:text-gray-900 text-3xl" />
            My Projects
          </h3>
          <p className="text-gray-400 dark:text-gray-600 mt-2">
            The projects showcasing my skills and experience
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {projectList.map((project, index) => (
            <ProjectCard
              key={index}
              project={project}
              visible={visible}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------- Project Card ---------- */

const ProjectCard = ({ project, visible, delay }) => (
  <div
    style={{ transitionDelay: `${delay}ms` }}
    className={`group border border-gray-700 dark:border-gray-300 rounded-2xl overflow-hidden hover:border-yellow-400 dark:hover:border-blue-500 transition-all duration-700 bg-gray-800 dark:bg-white flex flex-col justify-between ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
  >
    <div>
      {/* Image */}
      <div className="overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-48 object-cover transform group-hover:scale-110 transition duration-700"
        />
      </div>

      {/* Content */}
      <div className="p-6 space-y-3">
        {/* ✅ FIXED TITLE */}
        <h4 className="text-xl font-semibold text-white dark:text-gray-900 break-words leading-snug">
          {project.title}
        </h4>

        <p className="text-gray-400 dark:text-gray-600 text-sm leading-relaxed">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 pt-1">
          {project.techStack?.map((tech, i) => (
            <span
              key={i}
              className="text-[11px] font-semibold bg-gray-700/50 text-yellow-400 dark:bg-gray-100 dark:text-blue-600 px-2.5 py-1 rounded-md"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>

    {/* Actions */}
    <div className="p-6 pt-0">
      <div className="flex gap-4 pt-2 border-t border-gray-700/50 dark:border-gray-200">
        <a
          href={project.github}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-sm hover:text-white dark:hover:text-gray-900 transition text-gray-400 dark:text-gray-600 font-medium"
        >
          <FaGithub />
          Code
        </a>
      </div>
    </div>
  </div>
);

export default Project;