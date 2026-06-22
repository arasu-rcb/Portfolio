import React, { useEffect, useRef, useState } from "react";
import { FaBriefcase, FaLaptopCode, FaServer, FaFileAlt, FaTimes, FaShieldAlt } from "react-icons/fa";
import Vcodez from '../assets/Vcodez.pdf';
import CodeTech from '../assets/CodeTech.pdf';
import Teachnook from '../assets/Teachnook.pdf';

const staticExperiences = [
  {
    role: "Cyber Security",
    company: "Teachnook",
    type: "Remote",
    duration: "November 2022 – December 2022",
    certificateUrl: Teachnook,
    isStatic: true
  },
  {
    role: "Java Full Stack Development",
    company: "VCodesz Innovated Ideas, Chennai",
    type: "On-Site",
    duration: "April 2025 – June 2025",
    certificateUrl: Vcodez,
    isStatic: true
  },
  {
    role: "MERN Stack Development",
    company: "CodeTech IT Solutions, Telangana",
    type: "Remote",
    duration: "September 2025 – December 2025",
    certificateUrl: CodeTech,
    isStatic: true
  }
];

const getExperienceIcon = (role) => {
  const r = role.toLowerCase();
  if (r.includes("security") || r.includes("cyber")) return <FaShieldAlt />;
  if (r.includes("full stack") || r.includes("java") || r.includes("front") || r.includes("web") || r.includes("development")) return <FaLaptopCode />;
  if (r.includes("mern") || r.includes("backend") || r.includes("node") || r.includes("server")) return <FaServer />;
  return <FaBriefcase />;
};

const Experience = () => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [expList, setExpList] = useState([]);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [activeCertificate, setActiveCertificate] = useState("");

  useEffect(() => {
    // Fetch experiences using full backend URL
    const controller = new AbortController();
    const fetchExperience = async () => {
      try {
        const response = await fetch("https://arasuportfolio.onrender.com/api/experience", { signal: controller.signal });
        if (!response.ok) throw new Error("API not active");
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setExpList(data);
        } else {
          setExpList(staticExperiences);
        }
      } catch (error) {
        console.log("Using static Experience fallback data.", error);
        setExpList(staticExperiences);
      }
    };
    fetchExperience();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    // Fail-safe: ensure visibility after 1.5 seconds even if scroll observer fails
    const safetyTimer = setTimeout(() => {
      setVisible(true);
    }, 1500);

    return () => {
      controller.abort();
      clearTimeout(safetyTimer);
      observer.disconnect();
    };
  }, []);

  // Open Certificate Modal
  const openCertificate = (file) => {
    setActiveCertificate(file);
    setShowModal(true);
  };

  // Close Modal
  const closeModal = () => {
    setShowModal(false);
    setActiveCertificate("");
  };

  return (
    <>
      <section
        id="experience"
        ref={sectionRef}
        className="w-full bg-gray-900 dark:bg-gray-200 text-gray-300 dark:text-gray-800 py-20 px-6 scroll-mt-24"
      >
        <div className="max-w-6xl mx-auto">

          {/* Title */}
          <h3
            className={`text-3xl font-bold text-white dark:text-gray-900 mb-16 flex items-center justify-center gap-4 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
          >
            <FaBriefcase className="text-4xl" />
            Experience
          </h3>

          {/* Timeline */}
          <div className="space-y-20 ml-6">
            {expList.map((exp, index) => (
              <ExperienceItem
                key={exp._id || index}
                visible={visible}
                icon={getExperienceIcon(exp.role)}
                title={exp.role}
                company={exp.company}
                type={exp.type}
                duration={exp.duration}
                onView={exp.certificateUrl ? () => openCertificate(exp.isStatic ? exp.certificateUrl : `https://arasuportfolio.onrender.com${exp.certificateUrl}`) : null}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CERTIFICATE MODAL ---------------- */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

          <div className="relative bg-white dark:bg-gray-900 w-[90%] md:w-[70%] h-[80%] rounded-2xl shadow-2xl overflow-hidden">

            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition"
            >
              <FaTimes />
            </button>

            {/* Certificate Preview */}
            <iframe
              src={activeCertificate}
              title="Certificate Preview"
              className="w-full h-full rounded-2xl"
            ></iframe>

          </div>

        </div>
      )}

    </>
  );
};

/* ---------- Experience Timeline Item ---------- */

const ExperienceItem = ({
  icon,
  title,
  company,
  type,
  duration,
  visible,
  onView
}) => (
  <div
    className={`relative pl-10 sm:pl-14 transition-all duration-700 ease-out ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
      }`}
  >

    {/* Vertical Line */}
    <span className="absolute left-[5px] top-14 bottom-0 w-[2px] bg-yellow-400 dark:bg-blue-500" />

    {/* Icon */}
    <span className="absolute left-[-16px] top-0 w-12 h-12 bg-gray-900 dark:bg-gray-200 border-2 border-yellow-400 dark:border-blue-500 rounded-full flex items-center justify-center shadow-lg">
      <span className="text-2xl text-yellow-400 dark:text-blue-500">
        {icon}
      </span>
    </span>

    {/* Content */}
    <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:gap-6 border border-gray-700 dark:border-gray-300 rounded-2xl hover:border-yellow-400 dark:hover:border-blue-500 hover:bg-gray-800 dark:hover:bg-gray-100 transition px-4 sm:px-6 py-5">

      {/* Left Content */}
      <div className="space-y-2 flex-1">

        <h4 className="text-lg sm:text-xl font-semibold text-white dark:text-gray-900 break-words">
          {title}
        </h4>

        <p className="text-gray-400 dark:text-gray-600 text-sm sm:text-base break-words">
          {company}
        </p>

        <p className="text-sm text-gray-300 dark:text-gray-700">
          {type}
        </p>

        <p className="text-sm text-gray-300 dark:text-gray-700">
          {duration}
        </p>

      </div>

      {/* Right Button */}
      {onView && (
        <button
          onClick={onView}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-yellow-400 dark:bg-blue-400 text-gray-900 dark:text-white px-5 py-2 rounded-full font-medium hover:scale-105 transition shadow-md whitespace-nowrap"
        >
          <FaFileAlt />
          Certificate
        </button>
      )}

    </div>

  </div>
);

export default Experience;
