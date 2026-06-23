import React, { useState, useEffect } from "react";
import API from "../utils/api";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSave,
  FaBrain,
  FaNetworkWired,
  FaServer,
  FaMicrochip,
  FaTools,
  FaShieldAlt,
  FaHtml5,
  FaCss3Alt,
  FaReact,
  FaNodeJs,
  FaPython,
  FaJava,
  FaGithub,
  FaPhp,
  FaRust,
  FaDocker,
  FaAws,
  FaLinux,
  FaWindows,
  FaApple,
  FaTerminal,
  FaCode,
  FaDatabase,
  FaCloud,
  FaLaptopCode,
  FaMobileAlt,
  FaGlobe,
  FaJs,
  FaGitAlt,
  FaMicrosoft
} from "react-icons/fa";
import {
  SiTailwindcss,
  SiMongodb,
  SiMysql,
  SiVercel,
  SiNetlify,
  SiBootstrap,
  SiSvelte,
  SiVuedotjs,
  SiAngular,
  SiTypescript,
  SiJquery,
  SiCplusplus,
  SiSharp,
  SiRuby,
  SiSwift,
  SiKotlin,
  SiPostgresql,
  SiRedis,
  SiSqlite,
  SiOracle,
  SiKubernetes,
  SiFirebase,
  SiGooglecloud,
  SiHeroku,
  SiDigitalocean,
  SiFigma,
  SiGo
} from "react-icons/si";

const availableIcons = [
  "FaTools",
  "FaNetworkWired",
  "FaServer",
  "FaMicrochip",
  "FaShieldAlt",
  "FaHtml5",
  "FaCss3Alt",
  "FaReact",
  "SiTailwindcss",
  "FaNodeJs",
  "SiMongodb",
  "SiMysql",
  "FaPython",
  "FaJava",
  "FaGithub",
  "SiVercel",
  "SiNetlify",
  "SiBootstrap",
  "SiSvelte",
  "SiVuedotjs",
  "SiAngular",
  "SiTypescript",
  "SiJquery",
  "FaJs",
  "FaPhp",
  "FaRust",
  "SiGo",
  "SiCplusplus",
  "SiCsharp",
  "SiRuby",
  "SiSwift",
  "SiKotlin",
  "FaDocker",
  "SiKubernetes",
  "FaAws",
  "SiFirebase",
  "SiGooglecloud",
  "SiMicrosoftazure",
  "SiHeroku",
  "SiDigitalocean",
  "SiPostgresql",
  "SiRedis",
  "SiSqlite",
  "SiOracle",
  "FaGitAlt",
  "SiFigma",
  "FaLinux",
  "FaWindows",
  "FaApple",
  "FaTerminal",
  "FaCode",
  "FaDatabase",
  "FaCloud",
  "FaLaptopCode",
  "FaMobileAlt",
  "FaGlobe",
  "FaBrain"
];

const iconComponentMap = {
  FaNetworkWired: <FaNetworkWired />,
  FaServer: <FaServer />,
  FaMicrochip: <FaMicrochip />,
  FaTools: <FaTools />,
  FaShieldAlt: <FaShieldAlt />,
  FaHtml5: <FaHtml5 />,
  FaCss3Alt: <FaCss3Alt />,
  FaReact: <FaReact />,
  SiTailwindcss: <SiTailwindcss />,
  FaNodeJs: <FaNodeJs />,
  SiMongodb: <SiMongodb />,
  SiMysql: <SiMysql />,
  FaPython: <FaPython />,
  FaJava: <FaJava />,
  FaGithub: <FaGithub />,
  SiVercel: <SiVercel />,
  SiNetlify: <SiNetlify />,
  SiBootstrap: <SiBootstrap />,
  SiSvelte: <SiSvelte />,
  SiVuedotjs: <SiVuedotjs />,
  SiAngular: <SiAngular />,
  SiTypescript: <SiTypescript />,
  SiJquery: <SiJquery />,
  FaJs: <FaJs />,
  FaPhp: <FaPhp />,
  FaRust: <FaRust />,
  SiGo: <SiGo />,
  SiCplusplus: <SiCplusplus />,
  SiSharp: <SiSharp />,
  SiRuby: <SiRuby />,
  SiSwift: <SiSwift />,
  SiKotlin: <SiKotlin />,
  FaDocker: <FaDocker />,
  SiKubernetes: <SiKubernetes />,
  FaAws: <FaAws />,
  SiFirebase: <SiFirebase />,
  SiGooglecloud: <SiGooglecloud />,
  FaMicrosoft: <FaMicrosoft />,
  SiHeroku: <SiHeroku />,
  SiDigitalocean: <SiDigitalocean />,
  SiPostgresql: <SiPostgresql />,
  SiRedis: <SiRedis />,
  SiSqlite: <SiSqlite />,
  SiOracle: <SiOracle />,
  FaGitAlt: <FaGitAlt />,
  SiFigma: <SiFigma />,
  FaLinux: <FaLinux />,
  FaWindows: <FaWindows />,
  FaApple: <FaApple />,
  FaTerminal: <FaTerminal />,
  FaCode: <FaCode />,
  FaDatabase: <FaDatabase />,
  FaCloud: <FaCloud />,
  FaLaptopCode: <FaLaptopCode />,
  FaMobileAlt: <FaMobileAlt />,
  FaGlobe: <FaGlobe />,
  FaBrain: <FaBrain />
};

const renderIconPreview = (iconName) => {
  if (iconName && (iconName.startsWith("/uploads/") || iconName.startsWith("http"))) {
    return (
      <img
        src={`https://arasuportfolio.onrender.com${iconName}`}
        alt="Skill Icon"
        className="w-5 h-5 object-contain inline-block"
      />
    );
  }
  return iconComponentMap[iconName] || <FaTools />;
};

const presetCategories = [
  "Hardware & Networking",
  "Web Development",
  "Programming Languages",
  "Tools"
];

const SkillsEditor = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", isError: false });

  // Form / Modal States
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isCustom, setIsCustom] = useState(false);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [iconType, setIconType] = useState("preset"); // "preset" or "upload"
  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    percentage: 80,
    category: "Web Development",
    icon: "FaTools"
  });

  // Extract all categories from skills in database
  const uniqueCategories = Array.from(new Set(skills.map((s) => s.category).filter(Boolean)));

  // Combine preset categories and unique categories from database
  const allCategories = [
    ...presetCategories,
    ...uniqueCategories.filter((c) => !presetCategories.includes(c))
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
    setIsCustom(false);
    setIsCustomCategory(false);
    setIconType("preset");
    setIconFile(null);
    setIconPreview("");
    setFormData({
      name: "",
      percentage: 80,
      category: "Web Development",
      icon: "FaTools"
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (skill) => {
    setEditId(skill._id);
    setIconFile(null);
    setIsCustomCategory(!presetCategories.includes(skill.category || "Web Development"));
    if (skill.icon && (skill.icon.startsWith("/uploads/") || skill.icon.startsWith("http"))) {
      setIconType("upload");
      setIconPreview(`https://arasuportfolio.onrender.com${skill.icon}`);
      setIsCustom(false);
      setFormData({
        name: skill.name || "",
        percentage: skill.percentage || 80,
        category: skill.category || "Web Development",
        icon: ""
      });
    } else {
      setIconType("preset");
      setIconPreview("");
      setIsCustom(!availableIcons.includes(skill.icon || "FaTools"));
      setFormData({
        name: skill.name || "",
        percentage: skill.percentage || 80,
        category: skill.category || "Web Development",
        icon: skill.icon || "FaTools"
      });
    }
    setShowModal(true);
  };

  const handleIconFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIconFile(file);
      setIconPreview(URL.createObjectURL(file));
    }
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

    // Prepare FormData payload
    const data = new FormData();
    data.append("name", formData.name);
    data.append("percentage", Number(formData.percentage));
    data.append("category", formData.category);

    if (iconType === "upload") {
      if (iconFile) {
        data.append("iconFile", iconFile);
      } else if (!editId) {
        setMessage({ text: "Please select an icon file to upload", isError: true });
        setSaving(false);
        return;
      }
    } else {
      data.append("icon", formData.icon || "FaTools");
    }

    try {
      if (editId) {
        await API.put(`/skills/${editId}`, data, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        setMessage({ text: "Skill updated successfully! ✅", isError: false });
      } else {
        await API.post("/skills", data, {
          headers: { "Content-Type": "multipart/form-data" }
        });
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
  const groupedSkills = allCategories.reduce((acc, cat) => {
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
        {allCategories.map((cat) => {
          const list = groupedSkills[cat] || [];
          if (list.length === 0 && !presetCategories.includes(cat)) return null;
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
                      <div className="flex-1 min-w-0 flex items-center gap-3">
                        <div className="text-lg text-yellow-400 dark:text-blue-600 flex-shrink-0">
                          {renderIconPreview(skill.icon)}
                        </div>
                        <div className="truncate">
                          <p className="text-sm font-semibold text-white dark:text-gray-800 truncate">{skill.name}</p>
                        </div>
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
                  value={isCustomCategory ? "custom" : formData.category}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "custom") {
                      setIsCustomCategory(true);
                      setFormData({ ...formData, category: "" });
                    } else {
                      setIsCustomCategory(false);
                      setFormData({ ...formData, category: val });
                    }
                  }}
                  className="bg-gray-950 dark:bg-gray-50 border border-gray-800 dark:border-gray-200 rounded-xl w-full outline-none px-4 py-3 text-sm text-gray-200 dark:text-gray-800 focus:border-yellow-400 dark:focus:border-blue-500 transition"
                >
                  {allCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="custom">Custom Category...</option>
                </select>
              </div>

              {isCustomCategory && (
                <div className="pt-2">
                  <input
                    type="text"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Enter custom category name (e.g. Cloud & DevOps)"
                    className="bg-gray-950 dark:bg-gray-50 border border-gray-800 dark:border-gray-200 rounded-xl w-full outline-none px-4 py-2.5 text-xs text-gray-200 dark:text-gray-800 focus:border-yellow-400 dark:focus:border-blue-500 transition"
                  />
                </div>
              )}

              {/* Icon Type Tabs */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Icon Type</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIconType("preset")}
                    className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition ${
                      iconType === "preset"
                        ? "bg-yellow-400 dark:bg-blue-600 text-gray-950 dark:text-white border-yellow-400 dark:border-blue-600"
                        : "bg-gray-950 dark:bg-gray-50 border-gray-800 dark:border-gray-200 text-gray-400 dark:text-gray-600 hover:border-gray-750 dark:hover:border-gray-300"
                    }`}
                  >
                    Select/Custom Name
                  </button>
                  <button
                    type="button"
                    onClick={() => setIconType("upload")}
                    className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition ${
                      iconType === "upload"
                        ? "bg-yellow-400 dark:bg-blue-600 text-gray-950 dark:text-white border-yellow-400 dark:border-blue-600"
                        : "bg-gray-950 dark:bg-gray-50 border-gray-800 dark:border-gray-200 text-gray-400 dark:text-gray-600 hover:border-gray-750 dark:hover:border-gray-300"
                    }`}
                  >
                    Upload PNG/SVG Icon
                  </button>
                </div>
              </div>

              {iconType === "preset" ? (
                /* Icon Dropdown & Text Entry */
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Skill Icon</label>
                  <div className="flex gap-3 items-center">
                    <select
                      value={isCustom ? "custom" : formData.icon}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "custom") {
                          setIsCustom(true);
                          setFormData({ ...formData, icon: "" });
                        } else {
                          setIsCustom(false);
                          setFormData({ ...formData, icon: val });
                        }
                      }}
                      className="bg-gray-950 dark:bg-gray-50 border border-gray-800 dark:border-gray-200 rounded-xl flex-1 outline-none px-4 py-3 text-sm text-gray-200 dark:text-gray-800 focus:border-yellow-400 dark:focus:border-blue-500 transition"
                    >
                      {availableIcons.map((ic) => (
                        <option key={ic} value={ic}>
                          {ic}
                        </option>
                      ))}
                      <option value="custom">Custom Icon...</option>
                    </select>
                    <div className="w-11 h-11 flex items-center justify-center bg-gray-950 dark:bg-gray-50 border border-gray-800 dark:border-gray-200 rounded-xl text-yellow-400 dark:text-blue-600 text-xl flex-shrink-0">
                      {renderIconPreview(formData.icon)}
                    </div>
                  </div>

                  {isCustom && (
                    <div className="pt-2">
                      <input
                        type="text"
                        name="icon"
                        required
                        value={formData.icon}
                        onChange={handleChange}
                        placeholder="Enter custom icon name (e.g. FaDocker)"
                        className="bg-gray-950 dark:bg-gray-50 border border-gray-800 dark:border-gray-200 rounded-xl w-full outline-none px-4 py-2.5 text-xs text-gray-200 dark:text-gray-800 focus:border-yellow-400 dark:focus:border-blue-500 transition"
                      />
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 pl-1">
                        Type any mapped React-icon name (e.g. FaDocker, SiBootstrap, SiVue)
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* File Upload Block */
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">
                      Upload Icon File
                    </label>
                    <div className="flex items-center gap-3 border border-gray-800 dark:border-gray-200 rounded-xl px-4 py-3 bg-gray-950 dark:bg-gray-50 hover:border-gray-700 dark:hover:border-gray-300 transition relative">
                      <FaPlus className="text-gray-500" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleIconFileChange}
                        className="opacity-0 absolute inset-0 cursor-pointer w-full"
                      />
                      <span className="text-xs text-gray-400 dark:text-gray-600 truncate">
                        {iconFile ? iconFile.name : "Choose icon image/SVG..."}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-center pt-3">
                    {iconPreview ? (
                      <img
                        src={iconPreview}
                        alt="Icon Preview"
                        className="w-12 h-12 object-contain bg-white dark:bg-gray-50 rounded-xl border border-gray-800 dark:border-gray-200 p-2 shadow"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-950 dark:bg-gray-50 border border-gray-800 dark:border-gray-200 border-dashed rounded-xl flex items-center justify-center text-[10px] text-gray-500 dark:text-gray-400 text-center leading-tight">
                        No Preview
                      </div>
                    )}
                  </div>
                </div>
              )}

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
