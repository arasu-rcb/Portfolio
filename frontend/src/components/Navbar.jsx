import React, { useState, useEffect } from "react";
import {
  FaBars,
  FaTimes,
  FaMoon,
  FaSun,
  FaInfoCircle,
  FaProjectDiagram,
  FaEnvelope,
} from "react-icons/fa";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "light" ? false : true;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <>
      <nav className="w-full bg-gray-900 dark:bg-gray-200 text-gray-300 dark:text-gray-800 px-6 py-4 fixed top-0 z-50">

        {/* Top Row */}
        <div className="flex items-center justify-between">

          {/* Logo */}
          <h3 className="text-lg font-semibold text-white dark:text-gray-900">
            Portfolio
          </h3>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <NavItem icon={<FaInfoCircle />} text="About" link="#about" />
            <NavItem icon={<FaProjectDiagram />} text="Projects" link="#projects" />
            <NavItem icon={<FaEnvelope />} text="Contact" link="#contact" />

            <IconButton
              icon={darkMode ? <FaSun /> : <FaMoon />}
              onClick={toggleDarkMode}
            />
          </div>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center gap-3">

            {/* Dark Mode FIRST */}
            <IconButton
              icon={darkMode ? <FaSun /> : <FaMoon />}
              onClick={toggleDarkMode}
            />

            {/* Hamburger */}
            <button
              className="text-xl text-white dark:text-gray-900"
              onClick={() => setOpen(!open)}
            >
              {open ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden mt-4 bg-gray-800 dark:bg-gray-300 rounded-lg shadow-lg p-4 space-y-4">
            <MobileItem icon={<FaInfoCircle />} text="About" link="#about" setOpen={setOpen} />
            <MobileItem icon={<FaProjectDiagram />} text="Projects" link="#projects" setOpen={setOpen} />
            <MobileItem icon={<FaEnvelope />} text="Contact" link="#contact" setOpen={setOpen} />
          </div>
        )}
      </nav>

    </>
  );
};

/* ---------- Reusable Components ---------- */

const NavItem = ({ icon, text, link }) => (
  <a
    href={link}
    className="flex items-center gap-2 text-gray-300 dark:text-gray-800 hover:text-white dark:hover:text-gray-900 transition"
  >
    {icon}
    <span>{text}</span>
  </a>
);

const MobileItem = ({ icon, text, link, setOpen }) => (
  <a
    href={link}
    onClick={() => setOpen(false)}
    className="flex items-center gap-3 text-gray-300 dark:text-gray-800 hover:text-white dark:hover:text-gray-900 transition"
  >
    {icon}
    <span>{text}</span>
  </a>
);

const IconButton = ({ icon, full, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center ${full ? "w-full py-2" : "w-8 h-8"
      } text-gray-300 dark:text-gray-800 hover:text-white dark:hover:text-gray-900 transition`}
  >
    {icon}
  </button>
);

export default Navbar;