import React, { useState, useEffect } from "react";
import API from "../utils/api";
import {
  FaUser,
  FaHeading,
  FaFileAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaGithub,
  FaLinkedin,
  FaSave
} from "react-icons/fa";

const AboutEditor = () => {
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    email: "",
    phone: "",
    location: "",
    github: "",
    linkedin: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", isError: false });

  // Fetch current details
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await API.get("/about");
        if (response.data) {
          setFormData({
            name: response.data.name || "",
            title: response.data.title || "",
            description: response.data.description || "",
            email: response.data.email || "",
            phone: response.data.phone || "",
            location: response.data.location || "",
            github: response.data.github || "",
            linkedin: response.data.linkedin || ""
          });
        }
      } catch (err) {
        console.error("Error loading About details:", err);
        setMessage({ text: "Failed to load About details", isError: true });
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: "", isError: false });

    try {
      await API.put("/about", formData);
      setMessage({ text: "About details updated successfully! ✅", isError: false });
      
      // Auto-hide alert after 3 seconds
      setTimeout(() => setMessage({ text: "", isError: false }), 4000);
    } catch (err) {
      console.error("Error updating About details:", err);
      setMessage({
        text: err.response?.data?.message || "Failed to save details. Please try again.",
        isError: true
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[50vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-yellow-400 dark:border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-gray-900 dark:bg-white border border-gray-800 dark:border-gray-200 rounded-2xl shadow-2xl p-8 transition duration-300">
      
      {/* Alert Messaging */}
      {message.text && (
        <div
          className={`mb-6 p-4 rounded-xl text-sm font-semibold border text-center transition ${
            message.isError
              ? "bg-red-950/40 border-red-900 text-red-400"
              : "bg-green-950/40 border-green-900 text-green-400 dark:bg-green-100 dark:border-green-300 dark:text-green-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Row 1: Name and Title */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider">
              Full Name
            </label>
            <div className="flex items-center gap-3 border border-gray-800 dark:border-gray-300 rounded-xl px-4 py-3 bg-gray-950 dark:bg-gray-50 focus-within:border-yellow-400 dark:focus-within:border-blue-500 transition">
              <FaUser className="text-gray-500" />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Arasu Murali"
                className="bg-transparent w-full outline-none text-gray-200 dark:text-gray-800 placeholder-gray-600 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider">
              Professional Title
            </label>
            <div className="flex items-center gap-3 border border-gray-800 dark:border-gray-300 rounded-xl px-4 py-3 bg-gray-950 dark:bg-gray-50 focus-within:border-yellow-400 dark:focus-within:border-blue-500 transition">
              <FaHeading className="text-gray-500" />
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="Computer Science Engineer"
                className="bg-transparent w-full outline-none text-gray-200 dark:text-gray-800 placeholder-gray-600 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Description Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider">
            About Description
          </label>
          <div className="flex items-start gap-3 border border-gray-800 dark:border-gray-300 rounded-xl px-4 py-3 bg-gray-950 dark:bg-gray-50 focus-within:border-yellow-400 dark:focus-within:border-blue-500 transition">
            <FaFileAlt className="text-gray-500 mt-1" />
            <textarea
              name="description"
              required
              rows="5"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write a professional summary of your expertise..."
              className="bg-transparent w-full outline-none resize-none text-gray-200 dark:text-gray-800 placeholder-gray-600 text-sm leading-relaxed"
            ></textarea>
          </div>
        </div>

        {/* Row 2: Email and Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider">
              Email Address
            </label>
            <div className="flex items-center gap-3 border border-gray-800 dark:border-gray-300 rounded-xl px-4 py-3 bg-gray-950 dark:bg-gray-50 focus-within:border-yellow-400 dark:focus-within:border-blue-500 transition">
              <FaEnvelope className="text-gray-500" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="arasumurali014@gmail.com"
                className="bg-transparent w-full outline-none text-gray-200 dark:text-gray-800 placeholder-gray-600 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider">
              Phone Number
            </label>
            <div className="flex items-center gap-3 border border-gray-800 dark:border-gray-300 rounded-xl px-4 py-3 bg-gray-950 dark:bg-gray-50 focus-within:border-yellow-400 dark:focus-within:border-blue-500 transition">
              <FaPhoneAlt className="text-gray-500" />
              <input
                type="text"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="8608166921"
                className="bg-transparent w-full outline-none text-gray-200 dark:text-gray-800 placeholder-gray-600 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Row 3: Location and GitHub */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider">
              Location
            </label>
            <div className="flex items-center gap-3 border border-gray-800 dark:border-gray-300 rounded-xl px-4 py-3 bg-gray-950 dark:bg-gray-50 focus-within:border-yellow-400 dark:focus-within:border-blue-500 transition">
              <FaMapMarkerAlt className="text-gray-500" />
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                placeholder="Chennai, India"
                className="bg-transparent w-full outline-none text-gray-200 dark:text-gray-800 placeholder-gray-600 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider">
              GitHub Profile Link
            </label>
            <div className="flex items-center gap-3 border border-gray-800 dark:border-gray-300 rounded-xl px-4 py-3 bg-gray-950 dark:bg-gray-50 focus-within:border-yellow-400 dark:focus-within:border-blue-500 transition">
              <FaGithub className="text-gray-500" />
              <input
                type="url"
                name="github"
                required
                value={formData.github}
                onChange={handleChange}
                placeholder="https://github.com/arasu-rcb"
                className="bg-transparent w-full outline-none text-gray-200 dark:text-gray-800 placeholder-gray-600 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Row 4: LinkedIn */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider">
            LinkedIn Profile Link
          </label>
          <div className="flex items-center gap-3 border border-gray-800 dark:border-gray-300 rounded-xl px-4 py-3 bg-gray-950 dark:bg-gray-50 focus-within:border-yellow-400 dark:focus-within:border-blue-500 transition">
            <FaLinkedin className="text-gray-500" />
            <input
              type="url"
              name="linkedin"
              required
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="https://www.linkedin.com/in/arasu-murali/"
              className="bg-transparent w-full outline-none text-gray-200 dark:text-gray-800 placeholder-gray-600 text-sm"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-yellow-400 dark:bg-blue-500 text-gray-950 dark:text-white hover:bg-yellow-500 dark:hover:bg-blue-600 font-bold py-3.5 px-8 rounded-xl transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {saving ? (
              <span className="w-5 h-5 border-2 border-gray-950 dark:border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <FaSave />
                Save Changes
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AboutEditor;
