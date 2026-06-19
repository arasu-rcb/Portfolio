import React, { useState } from "react";
import { FaUser, FaEnvelope, FaCommentDots, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const [status, setStatus] = useState("");

  // handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const response = await fetch("http://localhost:5001/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("Message sent successfully ✅");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        setStatus(data.message || "Failed to send message ❌");
      }
    } catch {
      setStatus("Server error ❌");
    }
  };

  return (
    <section
      id="contact"
      className="w-full bg-gray-900 dark:bg-gray-200 text-gray-300 dark:text-gray-800 py-20 px-6 scroll-mt-24"
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-stretch">

        {/* LEFT: MAP */}
        <div className="w-full h-[400px] md:h-full rounded-xl overflow-hidden border border-gray-700 dark:border-gray-300">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d377.0549720355715!2d79.63926281869482!3d13.020883715706592!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sin!4v1737875258108!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
          ></iframe>
        </div>

        {/* RIGHT: FORM */}
        <div>
          <h3 className="text-3xl font-bold text-white dark:text-gray-900 mb-6 flex items-center gap-3">
            <FaMapMarkerAlt className="text-gray-700 dark:text-gray-900" />
            Contact Me
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="flex items-center gap-3 border border-gray-700 dark:border-gray-300 rounded-lg px-4 py-3 bg-gray-800 dark:bg-white">
              <FaUser className="text-gray-400 dark:text-gray-600" />
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="bg-transparent w-full outline-none text-gray-300 dark:text-gray-800 placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            <div className="flex items-center gap-3 border border-gray-700 dark:border-gray-300 rounded-lg px-4 py-3 bg-gray-800 dark:bg-white">
              <FaEnvelope className="text-gray-400 dark:text-gray-600" />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-transparent w-full outline-none text-gray-300 dark:text-gray-800 placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            <div className="flex items-center gap-3 border border-gray-700 dark:border-gray-300 rounded-lg px-4 py-3 bg-gray-800 dark:bg-white">
              <FaPhoneAlt className="text-gray-400 dark:text-gray-600" />
              <input
                type="tel"
                name="phone"
                placeholder="Your Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="bg-transparent w-full outline-none text-gray-300 dark:text-gray-800 placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            <div className="flex items-start gap-3 border border-gray-700 dark:border-gray-300 rounded-lg px-4 py-3 bg-gray-800 dark:bg-white">
              <FaCommentDots className="mt-1 text-gray-400 dark:text-gray-600" />
              <textarea
                name="message"
                placeholder="Your Message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
                className="bg-transparent w-full outline-none resize-none text-gray-300 dark:text-gray-800 placeholder-gray-500 dark:placeholder-gray-400"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-400 dark:bg-blue-500 text-gray-900 dark:text-white font-semibold py-3 rounded-lg hover:bg-yellow-300 dark:hover:bg-blue-600 transition"
            >
              Send Message
            </button>

            {status && (
              <p className="text-center mt-3 text-sm">{status}</p>
            )}
          </form>
        </div>

      </div>
    </section>
  );
};

export default Contact;
