import React, { useEffect, useRef, useState } from "react";
import { FaUserAlt, FaPhoneAlt, FaEnvelope, FaFileAlt, FaTimes } from "react-icons/fa";
import profile from '../assets/profile.png';
import resume from "../assets/Arasu Murali Updated Resume.pdf";

const About = () => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [showResume, setShowResume] = useState(false);

  const [aboutData, setAboutData] = useState({
    name: "Arasu Murali",
    title: "Computer Science Engineer",
    description: "I am a passionate and goal-oriented Computer Science and Engineering graduate with a specialization in Cyber Security from Bharath Institute of Higher Education and Research.\n\nMy primary areas of interest and expertise include Networking, Hardware, and Cyber Security, with a strong foundation in Web Development. I am proficient in programming languages and technologies such as Python, Java, SQL, Git, and GitHub. I am committed to continuously enhancing my technical skills and aspire to build a successful career in the fields of Networking and Cyber Security while contributing to innovative and secure technology solutions.",
    email: "arasumurali014@gmail.com",
    phone: "8608166921",
    location: "Chennai, India",
    github: "https://github.com/arasu-rcb",
    linkedin: "https://www.linkedin.com/in/arasu-murali/",
    profileImage: "",
    resumeUrl: ""
  });

  const [typedText, setTypedText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Parse roles from aboutData.title (split by '|', ',', or ';')
  const roles = aboutData.title
    ? aboutData.title.split(/[|,;]/).map((r) => r.trim()).filter(Boolean)
    : ["Computer Science Engineer"];

  const currentRole = roles[roleIndex % roles.length] || "";
  const startsWithVowel = ["a", "e", "i", "o", "u"].includes(currentRole.trim().charAt(0).toLowerCase());

  // Reset typewriter states when title changes
  useEffect(() => {
    setTypedText("");
    setRoleIndex(0);
    setIsDeleting(false);
  }, [aboutData.title]);

  useEffect(() => {
    if (roles.length === 0) return;

    let timer;

    if (!isDeleting && typedText === currentRole) {
      // Pause at full text
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 1500);
    } else if (isDeleting && typedText === "") {
      // Reset deleting and step to next role
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
    } else if (isDeleting) {
      // Deleting character
      timer = setTimeout(() => {
        setTypedText((prev) => prev.slice(0, -1));
      }, 50);
    } else {
      // Typing character
      timer = setTimeout(() => {
        setTypedText(currentRole.slice(0, typedText.length + 1));
      }, 100);
    }

    return () => clearTimeout(timer);
  }, [typedText, isDeleting, roleIndex, currentRole, roles]);

  useEffect(() => {
    // Fetch dynamic About info
    fetch("http://localhost:5001/api/about")
      .then((res) => {
        if (!res.ok) throw new Error("API not active");
        return res.json();
      })
      .then((data) => {
        if (data) {
          setAboutData({
            name: data.name || "Arasu Murali",
            title: data.title || "Computer Science Engineer",
            description: data.description || "",
            email: data.email || "arasumurali014@gmail.com",
            phone: data.phone || "8608166921",
            location: data.location || "Chennai, India",
            github: data.github || "https://github.com/arasu-rcb",
            linkedin: data.linkedin || "https://www.linkedin.com/in/arasu-murali/",
            profileImage: data.profileImage || "",
            resumeUrl: data.resumeUrl || ""
          });
        }
      })
      .catch(() => console.log("Using static About fallback data."));

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
    <>
      <section
        id="about"
        ref={sectionRef}
        className="w-full bg-gray-900 dark:bg-gray-200 text-gray-300 dark:text-gray-800 pt-32 pb-20 px-6 overflow-hidden"
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">

          {/* LEFT CONTENT */}
          <div
            className={`md:w-2/3 transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
          >
            {/* Greeting / Name & Typing effect */}
            <h1 className="text-4xl md:text-5xl font-extrabold text-white dark:text-gray-900 mb-2 tracking-tight">
              Hi, I'm <span className="text-yellow-400 dark:text-blue-600">{aboutData.name}</span>
            </h1>
            <p className="text-lg md:text-xl font-semibold text-gray-400 dark:text-gray-600 mb-6 min-h-[2rem] flex flex-wrap items-center">
              I am {startsWithVowel ? "an" : "a"}&nbsp;
              <span className="text-yellow-400 dark:text-blue-600 font-bold border-r-2 border-yellow-400 dark:border-blue-600 pr-1.5 pr-1 animate-blink">
                {typedText}
              </span>
            </p>

            {/* Contact Info directly below Role */}
            <div className="space-y-3 mt-6 text-yellow-400 dark:text-blue-600">
              <p className="flex items-center gap-3">
                <FaPhoneAlt className="text-white dark:text-gray-900 transition" />
                <a
                  href={`tel:${aboutData.phone}`}
                  className="hover:text-yellow-400 dark:hover:text-blue-700 text-white dark:text-gray-900 transition font-medium"
                >
                  {aboutData.phone}
                </a>
              </p>

              <p className="flex items-center gap-3">
                <FaEnvelope className="text-white dark:text-gray-900" />
                <a
                  href={`mailto:${aboutData.email}`}
                  className="hover:text-yellow-400 dark:hover:text-blue-700 text-white dark:text-gray-900 transition font-medium"
                >
                  {aboutData.email}
                </a>
              </p>
            </div>

            {/* Resume button directly below contact info */}
            <div className="mt-8">
              <button
                onClick={() => setShowResume(true)}
                className="flex items-center gap-2 bg-yellow-400 dark:bg-blue-600 text-gray-900 dark:text-white px-6 py-2.5 rounded-full font-semibold hover:scale-105 transition shadow-lg hover:bg-yellow-500 dark:hover:bg-blue-700"
              >
                <FaFileAlt />
                View Resume
              </button>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div
            className={`md:w-1/3 flex justify-center transition-all duration-700 ease-out delay-150 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
              }`}
          >
            <div className="w-64 h-64 overflow-hidden rounded-2xl shadow-xl border border-gray-700 dark:border-gray-300">
              <img
                src={aboutData.profileImage ? `http://localhost:5001${aboutData.profileImage}` : profile}
                alt="Arasu Murali"
                className="w-full h-full object-cover scale-[1.25] origin-top"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT ME SECTION */}
      <section
        className="w-full bg-gray-900 dark:bg-gray-200 text-gray-300 dark:text-gray-800 py-16 px-6 overflow-hidden scroll-mt-24"
      >
        <div className="max-w-5xl mx-auto">
          {/* Title */}
          <h3 className="text-3xl font-bold text-white dark:text-gray-900 mb-8 flex items-center justify-center gap-4">
            <FaUserAlt className="text-3xl text-white dark:text-gray-900" />
            About Me
          </h3>

          {/* About Text */}
          <div className="leading-relaxed text-gray-300 dark:text-gray-700 text-sm md:text-base space-y-4 max-w-4xl mx-auto">
            {aboutData.description.split("\n\n").map((para, i) => (
              <p key={i} className="text-center md:text-left">{para}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ Resume Modal Popup */}
      {showResume && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

          <div className="relative bg-white dark:bg-gray-900 w-[90%] md:w-[70%] h-[80%] rounded-2xl shadow-2xl overflow-hidden">

            {/* Close Button */}
            <button
              onClick={() => setShowResume(false)}
              className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition"
            >
              <FaTimes />
            </button>

            {/* PDF Viewer */}
            <iframe
              src={aboutData.resumeUrl ? `http://localhost:5001${aboutData.resumeUrl}` : resume}
              title="Resume"
              className="w-full h-full rounded-2xl"
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
};

export default About;
