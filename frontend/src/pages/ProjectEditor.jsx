import React, { useState, useEffect } from "react";
import API from "../utils/api";
import { FaPlus, FaEdit, FaTrash, FaGithub, FaLink, FaImage, FaTimes, FaSave, FaArrowLeft, FaArrowRight } from "react-icons/fa";

const ProjectEditor = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", isError: false });

  // Modal / Form States
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    github: "",
    liveLink: "",
    techStack: "",
    order: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Fetch all projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setMessage({ text: "Failed to load projects", isError: true });
    } finally {
      setLoading(false);
    }
  };

  const handleMove = async (index, direction) => {
    const newProjects = [...projects];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    // Swap items
    const temp = newProjects[index];
    newProjects[index] = newProjects[targetIndex];
    newProjects[targetIndex] = temp;

    // Optimistically update local UI state
    setProjects(newProjects);

    try {
      const orderIds = newProjects.map((p) => p._id);
      await API.put("/projects/reorder", { order: orderIds });
    } catch (err) {
      console.error("Error saving project order:", err);
      setMessage({ text: "Failed to update project order in database.", isError: true });
      fetchProjects(); // reload/rollback on failure
    }
  };

  const handleOpenAddModal = () => {
    setEditId(null);
    setFormData({
      title: "",
      description: "",
      github: "",
      liveLink: "",
      techStack: "",
      order: "",
    });
    setImageFile(null);
    setImagePreview("");
    setShowModal(true);
  };

  const handleOpenEditModal = (project) => {
    setEditId(project._id);
    setFormData({
      title: project.title || "",
      description: project.description || "",
      github: project.github || "",
      liveLink: project.liveLink || "",
      techStack: Array.isArray(project.techStack) ? project.techStack.join(", ") : "",
      order: project.order !== undefined ? String(project.order) : "",
    });
    setImageFile(null);
    // Prefix relative upload path with base URL
    setImagePreview(project.image ? `http://localhost:5001${project.image}` : "");
    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: "", isError: false });

    // Validate image file when adding a new project
    if (!editId && !imageFile) {
      setMessage({ text: "Please select a project image file", isError: true });
      setSaving(false);
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("github", formData.github);
    data.append("liveLink", formData.liveLink);
    data.append("order", formData.order);
    
    // Split techStack comma separated values into an array
    const stackArray = formData.techStack
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    data.append("techStack", JSON.stringify(stackArray));

    if (imageFile) {
      data.append("image", imageFile);
    }

    try {
      if (editId) {
        await API.put(`/projects/${editId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage({ text: "Project updated successfully! ✅", isError: false });
      } else {
        await API.post("/projects", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage({ text: "Project added successfully! ✅", isError: false });
      }
      setShowModal(false);
      fetchProjects();
      setTimeout(() => setMessage({ text: "", isError: false }), 4000);
    } catch (err) {
      console.error("Error saving project:", err);
      setMessage({
        text: err.response?.data?.message || "Failed to save project. Please try again.",
        isError: true,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await API.delete(`/projects/${id}`);
      setMessage({ text: "Project deleted successfully! 🗑️", isError: false });
      fetchProjects();
      setTimeout(() => setMessage({ text: "", isError: false }), 4000);
    } catch (err) {
      console.error("Error deleting project:", err);
      setMessage({ text: "Failed to delete project.", isError: true });
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
    <div className="space-y-6">
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

      {/* Title & Add Action */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-white dark:text-gray-900">Manage Projects</h3>
          <p className="text-gray-400 dark:text-gray-600 text-xs mt-1">View, add, edit, or remove your showcase projects</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-yellow-400 dark:bg-blue-600 text-gray-950 dark:text-white hover:bg-yellow-500 dark:hover:bg-blue-700 font-bold py-2.5 px-5 rounded-xl transition shadow-lg active:scale-95 text-sm"
        >
          <FaPlus /> Add Project
        </button>
      </div>

      {/* Grid List */}
      {projects.length === 0 ? (
        <div className="bg-gray-900 dark:bg-white border border-gray-800 dark:border-gray-200 rounded-2xl p-12 text-center text-gray-500 dark:text-gray-400 shadow-md">
          No projects found. Click "Add Project" to build your database!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div
              key={project._id}
              className="bg-gray-900 dark:bg-white border border-gray-800 dark:border-gray-200 rounded-2xl overflow-hidden hover:border-yellow-400/40 dark:hover:border-blue-500/40 transition flex flex-col justify-between dark:shadow-md"
            >
              <div>
                <img
                  src={`http://localhost:5001${project.image}`}
                  alt={project.title}
                  className="w-full h-40 object-contain bg-white dark:bg-gray-50 border-b border-gray-800 dark:border-gray-200"
                />
                <div className="p-5 space-y-3">
                  <h4 className="text-md font-bold text-white dark:text-gray-900 leading-snug truncate">{project.title}</h4>
                  <p className="text-xs text-gray-400 dark:text-gray-600 line-clamp-3 leading-relaxed">{project.description}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.techStack?.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold bg-gray-800 dark:bg-gray-100 text-yellow-400 dark:text-blue-600 px-2 py-0.5 rounded border border-gray-700/50 dark:border-gray-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-5 pt-0 flex justify-between items-center border-t border-gray-800/40 dark:border-gray-200 mt-4 gap-2">
                <div className="flex gap-2.5 text-sm text-gray-400 dark:text-gray-500">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white dark:hover:text-gray-900 transition"
                    title="GitHub Repository"
                  >
                    <FaGithub />
                  </a>
                  {project.liveLink && (
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-white dark:hover:text-gray-900 transition"
                      title="Live Preview"
                    >
                      <FaLink />
                    </a>
                  )}
                </div>

                {/* Move Arrows */}
                <div className="flex items-center gap-1 border border-gray-800 dark:border-gray-200 rounded-lg p-0.5 bg-gray-950/40 dark:bg-gray-50">
                  <button
                    type="button"
                    onClick={() => handleMove(index, -1)}
                    disabled={index === 0}
                    className="p-1 hover:bg-gray-800 dark:hover:bg-gray-200 text-yellow-400 dark:text-blue-600 rounded transition disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                    title="Move Left"
                  >
                    <FaArrowLeft size={10} />
                  </button>
                  <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 px-0.5 select-none">
                    #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleMove(index, 1)}
                    disabled={index === projects.length - 1}
                    className="p-1 hover:bg-gray-800 dark:hover:bg-gray-200 text-yellow-400 dark:text-blue-600 rounded transition disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                    title="Move Right"
                  >
                    <FaArrowRight size={10} />
                  </button>
                </div>

                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleOpenEditModal(project)}
                    className="p-2 bg-gray-800 dark:bg-gray-100 hover:bg-gray-700 dark:hover:bg-gray-200 text-yellow-400 dark:text-blue-600 rounded-lg transition"
                    title="Edit Project"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="p-2 bg-red-950/20 dark:bg-red-50 border border-red-900/30 dark:border-red-200 hover:bg-red-900/40 dark:hover:bg-red-100 text-red-400 dark:text-red-600 rounded-lg transition"
                    title="Delete Project"
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
          <div className="bg-gray-900 dark:bg-white border border-gray-800 dark:border-gray-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative animate-fadeIn">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-800 p-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition"
            >
              <FaTimes />
            </button>

            <h4 className="text-lg font-bold text-white dark:text-gray-900 mb-6">
              {editId ? "Edit Project Details" : "Add New Showcase Project"}
            </h4>

            <form onSubmit={handleFormSubmit} className="space-y-5">
              {/* Image upload preview row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Project Preview Image
                  </label>
                  <div className="flex items-center gap-3 border border-gray-800 dark:border-gray-200 rounded-xl px-4 py-3 bg-gray-950 dark:bg-gray-50 hover:border-gray-700 dark:hover:border-gray-300 transition relative">
                    <FaImage className="text-gray-500" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="opacity-0 absolute inset-0 cursor-pointer w-full"
                    />
                    <span className="text-xs text-gray-400 dark:text-gray-600 truncate">
                      {imageFile ? imageFile.name : "Choose image file..."}
                    </span>
                  </div>
                </div>
                <div className="flex justify-center">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-24 object-contain bg-white dark:bg-gray-50 rounded-xl border border-gray-800 dark:border-gray-200 shadow"
                    />
                  ) : (
                    <div className="w-full h-24 bg-gray-950 dark:bg-gray-50 border border-gray-800 dark:border-gray-200 border-dashed rounded-xl flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
                      No Image Selected
                    </div>
                  )}
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Project Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Dynamic Train Ticket Reservation System"
                  className="bg-gray-950 dark:bg-gray-50 border border-gray-800 dark:border-gray-200 rounded-xl w-full outline-none px-4 py-3 text-sm text-gray-200 dark:text-gray-800 focus:border-yellow-400 dark:focus:border-blue-500 transition"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Description</label>
                <textarea
                  name="description"
                  required
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Write a clear summary detailing key features and milestones..."
                  className="bg-gray-950 dark:bg-gray-50 border border-gray-800 dark:border-gray-200 rounded-xl w-full outline-none px-4 py-3 text-sm text-gray-200 dark:text-gray-800 focus:border-yellow-400 dark:focus:border-blue-500 transition resize-none leading-relaxed"
                ></textarea>
              </div>

              {/* GitHub Link & Live Link */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">GitHub URL</label>
                  <input
                    type="url"
                    name="github"
                    required
                    value={formData.github}
                    onChange={handleChange}
                    placeholder="https://github.com/..."
                    className="bg-gray-950 dark:bg-gray-50 border border-gray-800 dark:border-gray-200 rounded-xl w-full outline-none px-4 py-3 text-sm text-gray-200 dark:text-gray-800 focus:border-yellow-400 dark:focus:border-blue-500 transition"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Live Demo URL (Optional)
                  </label>
                  <input
                    type="url"
                    name="liveLink"
                    value={formData.liveLink}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="bg-gray-950 dark:bg-gray-50 border border-gray-800 dark:border-gray-200 rounded-xl w-full outline-none px-4 py-3 text-sm text-gray-200 dark:text-gray-800 focus:border-yellow-400 dark:focus:border-blue-500 transition"
                  />
                </div>
              </div>

              {/* Display Order Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Display Order Position (Optional)
                </label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  placeholder="e.g. 0, 1, 2... (defaults to end of list)"
                  className="bg-gray-950 dark:bg-gray-50 border border-gray-800 dark:border-gray-200 rounded-xl w-full outline-none px-4 py-3 text-sm text-gray-200 dark:text-gray-800 focus:border-yellow-400 dark:focus:border-blue-500 transition"
                />
              </div>

              {/* Tech Stack */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Technologies (Comma Separated)
                </label>
                <input
                  type="text"
                  name="techStack"
                  required
                  value={formData.techStack}
                  onChange={handleChange}
                  placeholder="React.js, Node.js, Express.js, MongoDB"
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
                      Save Project
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

export default ProjectEditor;
