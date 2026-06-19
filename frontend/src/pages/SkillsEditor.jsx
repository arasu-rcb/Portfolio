import React, { useState, useEffect } from "react";
import API from "../utils/api";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaBrain } from "react-icons/fa";

const SkillsEditor = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", isError: false });

  // Form / Modal States
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    percentage: 80,
    category: "Web Development"
  });

  const categories = [
    "Hardware & Networking",
    "Web Development",
    "Programming Languages",
    "Tools"
  ];

  // Fetch skills
  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await API.get("/skills");
      setSkills(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error loading skills:", err);
      setMessage({ text: "Failed to load skills list", isError: true });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditId(null);
    setFormData({
      name: "",
      percentage: 80,
      category: "Web Development"
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (skill) => {
    setEditId(skill._id);
    setFormData({
      name: skill.name || "",
      percentage: skill.percentage || 0,
      category: skill.category || "Web Development"
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
        await API.put(`/skills/${editId}`, formData);
        setMessage({ text: "Skill updated successfully! ✅", isError: false });
      } else {
        await API.post("/skills", formData);
        setMessage({ text: "Skill added successfully! ✅", isError: false });
      }
      setShowModal(false);
      fetchSkills();
      setTimeout(() => setMessage({ text: "", isError: false }), 4000);
    } catch (err) {
      console.error("Error saving skill:", err);
      setMessage({
        text: err.response?.data?.message || "Failed to save skill details.",
        isError: true
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;
    try {
      await API.delete(`/skills/${id}`);
      setMessage({ text: "Skill deleted successfully! 🗑️", isError: false });
      fetchSkills();
      setTimeout(() => setMessage({ text: "", isError: false }), 4000);
    } catch (err) {
      console.error("Error deleting skill:", err);
      setMessage({ text: "Failed to delete skill.", isError: true });
    }
  };

  if (loading) {
    return (
      <div className="h-[50vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Group skills by category for better display in the editor
  const groupedSkills = categories.reduce((acc, cat) => {
    acc[cat] = skills.filter((s) => s.category === cat);
    return acc;
  }, {});

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
          <h3 className="text-xl font-bold text-white dark:text-gray-900">Manage Technical Skills</h3>
          <p className="text-gray-400 dark:text-gray-600 text-xs mt-1">Configure your skill levels and categories</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-yellow-400 dark:bg-blue-600 text-gray-950 dark:text-white hover:bg-yellow-500 dark:hover:bg-blue-700 font-bold py-2.5 px-5 rounded-xl transition shadow-lg active:scale-95 text-sm"
        >
          <FaPlus /> Add Skill
        </button>
      </div>

      {/* Grid of categories */}
      <div className="space-y-6">
        {categories.map((cat) => {
          const list = groupedSkills[cat] || [];
          return (
            <div key={cat} className="bg-gray-900 dark:bg-white border border-gray-800 dark:border-gray-200 rounded-2xl p-6 space-y-4 dark:shadow-md">
              <h4 className="text-md font-bold text-yellow-400 dark:text-blue-600 border-b border-gray-800 dark:border-gray-200 pb-2">{cat}</h4>
              {list.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-xs italic">No skills in this category yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {list.map((skill) => (
                    <div
                      key={skill._id}
                      className="bg-gray-950 dark:bg-gray-50 border border-gray-800 dark:border-gray-200 rounded-xl p-4 flex justify-between items-center gap-4 hover:border-gray-750 dark:hover:border-gray-300 transition"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-sm font-semibold text-white dark:text-gray-800 truncate">{skill.name}</p>
                        </div>
                        {/* Progress bar removed as requested */}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleOpenEditModal(skill)}
                          className="p-2 bg-gray-900 dark:bg-gray-100 hover:bg-gray-850 dark:hover:bg-gray-200 text-yellow-400 dark:text-blue-600 rounded-lg transition text-xs"
                          title="Edit Skill"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(skill._id)}
                          className="p-2 bg-red-950/20 dark:bg-red-50 border border-red-900/30 dark:border-red-200 hover:bg-red-900/40 dark:hover:bg-red-100 text-red-400 dark:text-red-600 rounded-lg transition text-xs"
                          title="Delete Skill"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

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
              {editId ? "Edit Skill Details" : "Add New Skill"}
            </h4>

            <form onSubmit={handleFormSubmit} className="space-y-5">
              {/* Skill Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Skill Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. React.js"
                  className="bg-gray-950 dark:bg-gray-50 border border-gray-800 dark:border-gray-200 rounded-xl w-full outline-none px-4 py-3 text-sm text-gray-200 dark:text-gray-800 focus:border-yellow-400 dark:focus:border-blue-500 transition"
                />
              </div>

              {/* Category Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="bg-gray-950 dark:bg-gray-50 border border-gray-800 dark:border-gray-200 rounded-xl w-full outline-none px-4 py-3 text-sm text-gray-200 dark:text-gray-800 focus:border-yellow-400 dark:focus:border-blue-500 transition"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Range slider removed as requested, default payload is sent to DB */}

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
                      Save Skill
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

export default SkillsEditor;
