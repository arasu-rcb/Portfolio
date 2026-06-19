import React, { useState, useEffect } from "react";
import API from "../utils/api";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaFilePdf, FaBriefcase } from "react-icons/fa";

const ExperienceEditor = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", isError: false });

  // Form / Modal States
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    duration: "",
    description: "",
    type: "Remote"
  });
  const [certificateFile, setCertificateFile] = useState(null);
  const [certificatePreview, setCertificatePreview] = useState("");

  const types = ["Remote", "On-Site", "Hybrid"];

  // Fetch experiences
  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const res = await API.get("/experience");
      setExperiences(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error loading experiences:", err);
      setMessage({ text: "Failed to load experiences list", isError: true });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditId(null);
    setFormData({
      company: "",
      role: "",
      duration: "",
      description: "",
      type: "Remote"
    });
    setCertificateFile(null);
    setCertificatePreview("");
    setShowModal(true);
  };

  const handleOpenEditModal = (exp) => {
    setEditId(exp._id);
    setFormData({
      company: exp.company || "",
      role: exp.role || "",
      duration: exp.duration || "",
      description: exp.description || "",
      type: exp.type || "Remote"
    });
    setCertificateFile(null);
    setCertificatePreview(exp.certificateUrl ? `http://localhost:5001${exp.certificateUrl}` : "");
    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCertificateFile(file);
      setCertificatePreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: "", isError: false });

    const data = new FormData();
    data.append("company", formData.company);
    data.append("role", formData.role);
    data.append("duration", formData.duration);
    data.append("description", formData.description);
    data.append("type", formData.type);

    if (certificateFile) {
      data.append("certificate", certificateFile);
    }

    try {
      if (editId) {
        await API.put(`/experience/${editId}`, data, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        setMessage({ text: "Experience updated successfully! ✅", isError: false });
      } else {
        await API.post("/experience", data, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        setMessage({ text: "Experience added successfully! ✅", isError: false });
      }
      setShowModal(false);
      fetchExperiences();
      setTimeout(() => setMessage({ text: "", isError: false }), 4000);
    } catch (err) {
      console.error("Error saving experience:", err);
      setMessage({
        text: err.response?.data?.message || "Failed to save experience details.",
        isError: true
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this experience record?")) return;
    try {
      await API.delete(`/experience/${id}`);
      setMessage({ text: "Experience record deleted successfully! 🗑️", isError: false });
      fetchExperiences();
      setTimeout(() => setMessage({ text: "", isError: false }), 4000);
    } catch (err) {
      console.error("Error deleting experience:", err);
      setMessage({ text: "Failed to delete experience.", isError: true });
    }
  };

  if (loading) {
    return (
      <div className="h-[50vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Alert Messaging */}
      {message.text && (
        <div
          className={`p-4 rounded-xl text-sm font-semibold border text-center transition ${
            message.isError
              ? "bg-red-950/40 border-red-900 text-red-400 dark:bg-red-50 dark:border-red-200 dark:text-red-600"
              : "bg-green-950/40 border-green-900 text-green-400 dark:bg-green-50 dark:border-green-200 dark:text-green-600"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-white dark:text-gray-900">Manage Experience</h3>
          <p className="text-gray-400 dark:text-gray-600 text-xs mt-1">Configure your professional timeline and certificates</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-yellow-400 dark:bg-blue-600 text-gray-950 dark:text-white hover:bg-yellow-500 dark:hover:bg-blue-700 font-bold py-2.5 px-5 rounded-xl transition shadow-lg active:scale-95 text-sm"
        >
          <FaPlus /> Add Experience
        </button>
      </div>

      {/* List / Timeline display */}
      {experiences.length === 0 ? (
        <div className="bg-gray-900 dark:bg-white border border-gray-800 dark:border-gray-200 rounded-2xl p-12 text-center text-gray-500 dark:text-gray-400 dark:shadow-md">
          No experience records found. Click "Add Experience" to start.
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <div
              key={exp._id}
              className="bg-gray-900 dark:bg-white border border-gray-800 dark:border-gray-200 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-yellow-400/30 dark:hover:border-blue-500/30 transition dark:shadow-md"
            >
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-950 dark:bg-gray-50 flex items-center justify-center text-yellow-400 dark:text-blue-600 border border-gray-800 dark:border-gray-200 shadow">
                    <FaBriefcase />
                  </div>
                  <div>
                    <h4 className="text-md font-bold text-white dark:text-gray-800 leading-snug">{exp.role}</h4>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{exp.company}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-yellow-400/80 dark:text-blue-600/80">{exp.type}</span>
                  <span>•</span>
                  <span>{exp.duration}</span>
                </div>
                {exp.description && (
                  <p className="text-xs text-gray-400 dark:text-gray-650 leading-relaxed max-w-2xl">{exp.description}</p>
                )}
              </div>
              <div className="flex items-center gap-3 self-end md:self-auto">
                {exp.certificateUrl && (
                  <a
                    href={`http://localhost:5001${exp.certificateUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-xs bg-gray-950 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 border border-gray-800 dark:border-gray-200 hover:border-gray-700 dark:hover:border-gray-300 text-gray-300 dark:text-gray-700 font-semibold py-2 px-4 rounded-xl transition"
                  >
                    <FaFilePdf className="text-red-500" /> Certificate
                  </a>
                )}
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleOpenEditModal(exp)}
                    className="p-2 bg-gray-950 dark:bg-gray-100 border border-gray-800 dark:border-gray-200 hover:bg-gray-850 dark:hover:bg-gray-200 text-yellow-400 dark:text-blue-600 rounded-lg transition text-xs"
                    title="Edit Experience"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(exp._id)}
                    className="p-2 bg-red-950/20 dark:bg-red-50 border border-red-900/30 dark:border-red-200 hover:bg-red-900/40 dark:hover:bg-red-100 text-red-400 dark:text-red-600 rounded-lg transition text-xs"
                    title="Delete Experience"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FORM MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-gray-900 dark:bg-white border border-gray-800 dark:border-gray-200 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative animate-fadeIn">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-800 p-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition"
            >
              <FaTimes />
            </button>

            <h4 className="text-lg font-bold text-white dark:text-gray-900 mb-6">
              {editId ? "Edit Experience Details" : "Add Experience"}
            </h4>

            <form onSubmit={handleFormSubmit} className="space-y-5">
              {/* Role Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Role Title</label>
                <input
                  type="text"
                  name="role"
                  required
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="e.g. Cyber Security Intern"
                  className="bg-gray-950 dark:bg-gray-50 border border-gray-800 dark:border-gray-200 rounded-xl w-full outline-none px-4 py-3 text-sm text-gray-200 dark:text-gray-800 focus:border-yellow-400 dark:focus:border-blue-500 transition"
                />
              </div>

              {/* Company / Institution */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Company Name</label>
                <input
                  type="text"
                  name="company"
                  required
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g. Teachnook"
                  className="bg-gray-950 dark:bg-gray-50 border border-gray-800 dark:border-gray-200 rounded-xl w-full outline-none px-4 py-3 text-sm text-gray-200 dark:text-gray-800 focus:border-yellow-400 dark:focus:border-blue-500 transition"
                />
              </div>

              {/* Duration & Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Duration</label>
                  <input
                    type="text"
                    name="duration"
                    required
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="e.g. November 2022 – December 2022"
                    className="bg-gray-950 dark:bg-gray-50 border border-gray-800 dark:border-gray-200 rounded-xl w-full outline-none px-4 py-3 text-sm text-gray-200 dark:text-gray-800 focus:border-yellow-400 dark:focus:border-blue-500 transition"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Location Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="bg-gray-950 dark:bg-gray-50 border border-gray-800 dark:border-gray-200 rounded-xl w-full outline-none px-4 py-3 text-sm text-gray-200 dark:text-gray-800 focus:border-yellow-400 dark:focus:border-blue-500 transition"
                  >
                    {types.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Description</label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Summarize key tasks, tools used, and deliverables..."
                  className="bg-gray-950 dark:bg-gray-50 border border-gray-800 dark:border-gray-200 rounded-xl w-full outline-none px-4 py-3 text-sm text-gray-200 dark:text-gray-800 focus:border-yellow-400 dark:focus:border-blue-500 transition resize-none leading-relaxed"
                ></textarea>
              </div>

              {/* Certificate PDF Upload */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Certificate PDF (Optional)
                </label>
                <div className="flex items-center gap-3 border border-gray-800 dark:border-gray-200 rounded-xl px-4 py-3 bg-gray-950 dark:bg-gray-50 hover:border-gray-700 dark:hover:border-gray-300 transition relative">
                  <FaFilePdf className="text-gray-500" />
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="opacity-0 absolute inset-0 cursor-pointer w-full"
                  />
                  <span className="text-xs text-gray-400 dark:text-gray-600 truncate">
                    {certificateFile ? certificateFile.name : "Choose certificate file..."}
                  </span>
                </div>
                {certificatePreview && (
                  <p className="text-[11px] text-yellow-400/80 dark:text-blue-600/80">
                    Existing certificate PDF exists. Uploading a new one will replace it.
                  </p>
                )}
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-850 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 border border-gray-800 dark:border-gray-200 text-gray-300 dark:text-gray-700 font-semibold py-2.5 px-5 rounded-xl transition text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-yellow-400 dark:bg-blue-600 text-gray-950 dark:text-white hover:bg-yellow-500 dark:hover:bg-blue-700 font-bold py-2.5 px-6 rounded-xl transition disabled:opacity-50 text-sm shadow-lg"
                >
                  {saving ? (
                    <span className="w-5 h-5 border-2 border-gray-950 dark:border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <FaSave />
                      Save Experience
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperienceEditor;
