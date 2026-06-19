import React, { useEffect, useRef, useState } from "react";
import { FaGraduationCap, FaSchool, FaUniversity } from "react-icons/fa";

const staticEducation = [
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

const Education = () => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [educationList, setEducationList] = useState([]);

  useEffect(() => {
    // Fetch education details
    fetch("http://localhost:5001/api/education")
      .then((res) => {
        if (!res.ok) throw new Error("API not active");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setEducationList(data);
        } else {
          setEducationList(staticEducation);
        }
      })
      .catch(() => {
        console.log("Using static Education fallback data.");
        setEducationList(staticEducation);
      });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
  }, []);

  return (
    <section
      id="education"
      ref={sectionRef}
      className="w-full bg-gray-900 dark:bg-gray-200 text-gray-300 dark:text-gray-800 py-20 px-6 scroll-mt-24"
    >
      <div className="max-w-5xl mx-auto">

        {/* Title */}
        <h3
          className={`text-3xl font-bold text-white dark:text-gray-900 mb-16 flex items-center justify-center gap-4 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <FaGraduationCap className="text-4xl text-white dark:text-gray-900" />
          Education
        </h3>

        {/* Timeline */}
        <div className="space-y-20 ml-6">
          {educationList.map((edu, index) => (
            <EducationItem
              key={edu._id || index}
              visible={visible}
              icon={edu.degree.toLowerCase().includes("school") || edu.degree.toLowerCase().includes("secondary") ? <FaSchool /> : <FaUniversity />}
              title={edu.degree}
              institute={edu.institution}
              year={edu.year}
              score={edu.cgpa}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------- Timeline Item ---------- */

const EducationItem = ({ icon, title, institute, year, score, visible }) => (
  <div
    className={`relative pl-14 transition-all duration-700 ease-out ${
      visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
    }`}
  >
    {/* Vertical Line (starts below icon & ends at card bottom) */}
    <span className="absolute left-[5px] top-14 bottom-0 w-[2px] bg-yellow-400 dark:bg-blue-500" />

    {/* Icon */}
    <span className="absolute left-[-16px] top-0 w-12 h-12 bg-gray-900 dark:bg-gray-200 border-2 border-yellow-400 dark:border-blue-500 rounded-full flex items-center justify-center shadow-lg">
      <span className="text-2xl text-yellow-400 dark:text-blue-500">{icon}</span>
    </span>

    {/* Content */}
    <div className="border border-gray-700 dark:border-gray-300 rounded-2xl hover:border-yellow-400 dark:hover:border-blue-500 hover:bg-gray-800 dark:hover:bg-gray-100 transition">
      <div className="px-6 py-4 space-y-1">
        
        <h4 className="text-xl font-semibold text-white dark:text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">
          {title}
        </h4>

        <p className="text-gray-400 dark:text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">
          {institute}
        </p>

        <p className="text-sm text-gray-300 dark:text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
          {year}
        </p>

        <p className="text-sm text-gray-300 dark:text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
          {score}
        </p>

      </div>
    </div>
  </div>
);

export default Education;
