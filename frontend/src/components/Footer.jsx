import React from "react";
import { FaLinkedin, FaGithub, FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 dark:bg-gray-200 text-gray-300 dark:text-gray-800 py-6 px-6 border-t border-gray-700 dark:border-gray-300">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Left side: copyright */}
        <p className="text-sm text-gray-400 dark:text-gray-600">
          © 2026 Arasu Murali. All rights reserved.
        </p>

        {/* Right side: social media */}
        <div className="flex items-center gap-4">
          <a
            href="https://www.linkedin.com/in/arasu-murali-73220a345"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 dark:text-gray-600 hover:text-blue-600 dark:hover:text-blue-700 transition text-xl"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://github.com/arasu-rcb"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 dark:text-gray-600 hover:text-gray-100 dark:hover:text-gray-900 transition text-xl"
          >
            <FaGithub />
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61566470787771&mibextid=ZbWKwL"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 dark:text-gray-600 hover:text-blue-500 dark:hover:text-blue-600 transition text-xl"
          >
            <FaFacebook />
          </a>
          <a
            href="https://www.instagram.com/arasu._.14/profilecard/?igsh=aTliejh5bHZidjNu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 dark:text-gray-600 hover:text-pink-500 dark:hover:text-pink-600 transition text-xl"
          >
            <FaInstagram />
          </a>
          <a
            href="https://x.com/arasu_rcb"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 dark:text-gray-600 hover:text-blue-400 dark:hover:text-blue-500 transition text-xl"
          >
            <FaTwitter />
          </a>
          <a
            href="https://wa.me/918608166921"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 dark:text-gray-600 hover:text-green-500 dark:hover:text-green-600 transition text-xl"
          >
            <FaWhatsapp />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
