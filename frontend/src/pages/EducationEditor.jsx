import React, { useState, useEffect } from "react";
import API from "../utils/api";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaGraduationCap } from "react-icons/fa";

const EducationEditor = () => {
  const [educationList, setEducationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", isError: false });

  // Form / Modal States
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    degree: "",
    institution: "",
    year: "",
    cgpa: ""
  });

  // Fetch education records
  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const res = await API.get("/education");
      setEducationList(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error loading education details:", err);
      setMessage({ text: "Failed to load education list", isError: true });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditId(null);
    setFormData({
      degree: "",
      institution: "",
      year: "",
      cgpa: ""
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (edu) => {
    setEditId(edu._id);
    setFormData({
      degree: edu.degree || "",
      institution: edu.institution || "",
      year: edu.year || "",
      cgpa: edu.cgpa || ""
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: "", isError: false });

    try {
      if (editId) {
        await API.put(`/education/${editId}`, formData);
        setMessage({ text: "Education record updated successfully! ✅", isError: false });
      } else {
        await API.post("/education", formData);
        setMessage({ text: "Education record added successfully! ✅", isError: false });
      }
      setShowModal(false);
      fetchEducation();
      setTimeout(() => setMessage({ text: "", isError: false }), 4000);
    } catch (err) {
      console.error("Error saving education detail:", err);
      setMessage({
        text: err.response?.data?.message || "Failed to save education details.",
        isError: true
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this education record?")) return;
    try {
      await API.delete(`/education/${id}`);
      setMessage({ text: "Education record deleted successfully! 🗑️", isError: false });
      fetchEducation();
      setTimeout(() => setMessage({ text: "", isError: false }), 4000);
    } catch (err) {
      console.error("Error deleting education:", err);
      setMessage({ text: "Failed to delete education details.", isError: true });
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
          <h3 className="text-xl font-bold text-white dark:text-gray-900">Manage Education</h3>
          <p className="text-gray-400 dark:text-gray-600 text-xs mt-1">Configure your schools, universities, and certificates</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-yellow-400 dark:bg-blue-600 text-gray-950 dark:text-white hover:bg-yellow-500 dark:hover:bg-blue-700 font-bold py-2.5 px-5 rounded-xl transition shadow-lg active:scale-95 text-sm"
        >
          <FaPlus /> Add Education
        </button>
      </div>

      {/* List / Cards */}
      {educationList.length === 0 ? (
        <div className="bg-gray-900 dark:bg-white border border-gray-800 dark:border-gray-200 rounded-2xl p-12 text-center text-gray-500 dark:text-gray-400 dark:shadow-md">
          No education details found. Click "Add Education" to start.
        </div>
      ) : (
        <div className="space-y-4">
          {educationList.map((edu) => (
            <div
              key={edu._id}
              className="bg-gray-900 dark:bg-white border border-gray-800 dark:border-gray-200 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 hover:border-yellow-400/30 dark:hover:border-blue-500/30 transition dark:shadow-md"
            >
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-950 dark:bg-gray-50 flex items-center justify-center text-yellow-400 dark:text-blue-600 border border-gray-800 dark:border-gray-200 shadow">
                    <FaGraduationCap />
                  </div>
                  <div>
                    <h4 className="text-md font-bold text-white dark:text-gray-800 leading-snug">{edu.degree}</h4>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{edu.institution}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-semibold text-yellow-400 dark:text-blue-600">{edu.year}</span>
                  <span>•</span>
                  <span>{edu.cgpa}</span>
                </div>
              </div>
              <div className="flex gap-2 self-end sm:self-auto">
                <button
                  onClick={() => handleOpenEditModal(edu)}
                  className="p-2 bg-gray-950 dark:bg-gray-100 border border-gray-800 dark:border-gray-200 hover:bg-gray-800 dark:hover:bg-gray-200 text-yellow-400 dark:text-blue-600 rounded-lg transition text-xs"
                  title="Edit Education"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(edu._id)}
                  className="p-2 bg-red-950/20 dark:bg-red-50 border border-red-900/30 dark:border-red-200 hover:bg-red-900/40 dark:hover:bg-red-100 text-red-400 dark:text-red-600 rounded-lg transition text-xs"
                  title="Delete Education"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FORM MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-gray-900 dark:bg-white border border-gray-800 dark:border-gray-200 rounded-2xl w-full max-w-md shadow-2xl p-6 relative animate-fadeIn">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-800 p-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition"
            >
              <FaTimes />
            </button>

            <h4 className="text-lg font-bold text-white dark:text-gray-900 mb-6">
              {editId ? "Edit Education Detail" : "Add Education Record"}
            </h4>

            <form onSubmit={handleFormSubmit} className="space-y-5">
              {/* Degree Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Degree / Grade</label>
                <input
                  type="text"
                  name="degree"
                  required
                  value={formData.degree}
                  onChange={handleChange}
                  placeholder="e.g. B.Tech – Cyber Security"
                  className="bg-gray-950 dark:bg-gray-50 border border-gray-800 dark:border-gray-200 rounded-xl w-full outline-none px-4 py-3 text-sm text-gray-200 dark:text-gray-800 focus:border-yellow-400 dark:focus:border-blue-500 transition"
                />
              </div>

              {/* Institution Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  School / University
                </label>
                <input
                  type="text"
                  name="institution"
                  required
                  value={formData.institution}
                  onChange={handleChange}
                  placeholder="e.g. Bharath Institute of Higher Education"
                  className="bg-gray-950 dark:bg-gray-50 border border-gray-800 dark:border-gray-200 rounded-xl w-full outline-none px-4 py-3 text-sm text-gray-200 dark:text-gray-800 focus:border-yellow-400 dark:focus:border-blue-500 transition"
                />
              </div>

              {/* Passing Year / Duration */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Year Range</label>
                <input
                  type="text"
                  name="year"
                  required
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="e.g. 2022 – 2026"
                  className="bg-gray-950 dark:bg-gray-50 border border-gray-800 dark:border-gray-200 rounded-xl w-full outline-none px-4 py-3 text-sm text-gray-200 dark:text-gray-800 focus:border-yellow-400 dark:focus:border-blue-500 transition"
                />
              </div>

              {/* Grade Score CGPA */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Score / CGPA</label>
                <input
                  type="text"
                  name="cgpa"
                  required
                  value={formData.cgpa}
                  onChange={handleChange}
                  placeholder="e.g. CGPA: 8.0 or Percentage: 73.1%"
                  className="bg-gray-950 dark:bg-gray-50 border border-gray-800 dark:border-gray-200 rounded-xl w-full outline-none px-4 py-3 text-sm text-gray-200 dark:text-gray-800 focus:border-yellow-400 dark:focus:border-blue-500 transition"
                />
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
                      Save Education
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

export default EducationEditor;
