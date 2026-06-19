import React, { useEffect, useRef, useState } from "react";
import {
  FaHtml5,
  FaCss3Alt,
  FaReact,
  FaNodeJs,
  FaGithub,
  FaPython,
  FaJava,
  FaTools,
  FaNetworkWired,
  FaMicrochip,
  FaServer,
  FaShieldAlt,
} from "react-icons/fa";
import {
  SiTailwindcss,
  SiMongodb,
  SiMysql,
  SiVercel,
  SiNetlify,
} from "react-icons/si";

const skillIconMap = {
  "Network Protocols": <FaNetworkWired className="text-blue-400" />,
  "Routing & Switching": <FaServer className="text-indigo-400" />,
  "Hardware Assembly": <FaMicrochip className="text-purple-400" />,
  "Troubleshooting": <FaTools className="text-yellow-500" />,
  "Cyber Security (Basics)": <FaShieldAlt className="text-red-500" />,
  "HTML": <FaHtml5 className="text-orange-500" />,
  "CSS": <FaCss3Alt className="text-blue-500" />,
  "React.js": <FaReact className="text-cyan-400" />,
  "Tailwind CSS": <SiTailwindcss className="text-blue-400" />,
  "Node.js": <FaNodeJs className="text-green-500" />,
  "MongoDB": <SiMongodb className="text-green-600" />,
  "MySQL": <SiMysql className="text-blue-600" />,
  "Python": <FaPython className="text-yellow-400" />,
  "Java": <FaJava className="text-red-600" />,
  "GitHub": <FaGithub className="text-gray-400" />,
  "Vercel": <SiVercel className="text-white dark:text-gray-900" />,
  "Netlify": <SiNetlify className="text-cyan-300" />
};

const Skills = () => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [skillList, setSkillList] = useState([]);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    // Fetch dynamic skills
    fetch("http://localhost:5001/api/skills")
      .then((res) => {
        if (!res.ok) throw new Error("API not active");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setSkillList(data);
          setUseFallback(false);
        } else {
          setUseFallback(true);
        }
      })
      .catch(() => {
        console.log("Using static Skills fallback data.");
        setUseFallback(true);
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

    // Group skills dynamically if loaded
  const uniqueCategories = Array.from(new Set(skillList.map((s) => s.category)));
  const orderedCategories = [
    "Hardware & Networking",
    "Web Development",
    "Programming Languages",
    "Tools",
    ...uniqueCategories.filter(
      (c) =>
        !["Hardware & Networking", "Web Development", "Programming Languages", "Tools"].includes(c)
    ),
  ];

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="w-full bg-gray-900 dark:bg-gray-200 text-gray-300 dark:text-gray-800 py-20 px-6 overflow-hidden scroll-mt-24"
    >
      <div className="max-w-6xl mx-auto">

        {/* Section Title */}
        <h3
          className={`text-3xl font-bold text-white dark:text-gray-900 mb-12 text-center flex items-center justify-center gap-3 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
        >
          <FaTools className="text-xl text-white dark:text-gray-900" />
          My Skills
        </h3>

        {/* Skills Grid */}
        <div
          className={`grid gap-8 grid-cols-1 md:grid-cols-2 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
        >
          {useFallback ? (
            <>
              {/* Hardware & Networking */}
              <SkillCard title="Hardware & Networking">
                <Skill icon={<FaNetworkWired className="text-blue-400" />} name="Network Protocols" />
                <Skill icon={<FaServer className="text-indigo-400" />} name="Routing & Switching" />
                <Skill icon={<FaMicrochip className="text-purple-400" />} name="Hardware Assembly" />
                <Skill icon={<FaTools className="text-yellow-500" />} name="Troubleshooting" />
                <Skill icon={<FaShieldAlt className="text-red-500" />} name="Cyber Security (Basics)" />
              </SkillCard>

              {/* Web Development */}
              <SkillCard title="Web Development">
                <Skill icon={<FaHtml5 className="text-orange-500" />} name="HTML" />
                <Skill icon={<FaCss3Alt className="text-blue-500" />} name="CSS" />
                <Skill icon={<FaReact className="text-cyan-400" />} name="React.js" />
                <Skill icon={<SiTailwindcss className="text-blue-400" />} name="Tailwind CSS" />
                <Skill icon={<FaNodeJs className="text-green-500" />} name="Node.js" />
                <Skill icon={<SiMongodb className="text-green-600" />} name="MongoDB" />
                <Skill icon={<SiMysql className="text-blue-600" />} name="MySQL" />
              </SkillCard>

              {/* Programming Languages */}
              <SkillCard title="Programming Languages">
                <Skill icon={<FaPython className="text-yellow-400" />} name="Python" />
                <Skill icon={<FaJava className="text-red-600" />} name="Java" />
              </SkillCard>

              {/* Tools */}
              <SkillCard title="Tools">
                <Skill icon={<FaGithub className="text-gray-400" />} name="GitHub" />
                <Skill icon={<SiVercel className="text-white" />} name="Vercel" />
                <Skill icon={<SiNetlify className="text-cyan-300" />} name="Netlify" />
              </SkillCard>
            </>
          ) : (
            orderedCategories.map((cat) => {
              const catSkills = skillList.filter((s) => s.category === cat);
              if (catSkills.length === 0) return null;
              return (
                <SkillCard key={cat} title={cat}>
                  {catSkills.map((skill) => (
                    <Skill
                      key={skill._id}
                      icon={skillIconMap[skill.name] || <FaTools className="text-yellow-500" />}
                      name={skill.name}
                    />
                  ))}
                </SkillCard>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

/* ---------- Reusable Components ---------- */

const SkillCard = ({ title, children }) => (
  <div className="border border-gray-700 dark:border-gray-300 rounded-2xl p-6 transition transform hover:scale-105 bg-gray-800 dark:bg-gray-100">
    <h4 className="text-xl font-semibold text-white dark:text-gray-900 mb-5">{title}</h4>
    <div className="grid grid-cols-2 gap-4">{children}</div>
  </div>
);

const Skill = ({ icon, name }) => (
  <div className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-800 dark:hover:bg-gray-300 transition transform hover:scale-105 cursor-pointer">
    <span className="text-2xl">{icon}</span>
    <p className="text-white dark:text-gray-900 font-medium">{name}</p>
  </div>
);

export default Skills;
