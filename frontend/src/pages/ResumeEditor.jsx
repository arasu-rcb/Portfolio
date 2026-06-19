import React, { useState, useEffect } from "react";
import API from "../utils/api";
import { FaFilePdf, FaSave, FaTimes, FaCloudUploadAlt } from "react-icons/fa";

const ResumeEditor = () => {
  const [resumeUrl, setResumeUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", isError: false });
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch current resume path
  useEffect(() => {
    fetchResumePath();
  }, []);

  const fetchResumePath = async () => {
    try {
      const res = await API.get("/about");
      if (res.data && res.data.resumeUrl) {
        setResumeUrl(res.data.resumeUrl);
      }
    } catch (err) {
      console.error("Error loading resume details:", err);
      setMessage({ text: "Failed to load current resume details", isError: true });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setMessage({ text: "Only PDF documents are allowed", isError: true });
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setMessage({ text: "", isError: false });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setMessage({ text: "Please select a PDF document first.", isError: true });
      return;
    }

    setSaving(true);
    setMessage({ text: "", isError: false });

    const data = new FormData();
    data.append("resume", selectedFile);

    try {
      const res = await API.put("/about/resume", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setMessage({ text: "Resume updated successfully! ✅", isError: false });
      if (res.data && res.data.about && res.data.about.resumeUrl) {
        setResumeUrl(res.data.about.resumeUrl);
      }
      setSelectedFile(null);
      setTimeout(() => setMessage({ text: "", isError: false }), 4000);
    } catch (err) {
      console.error("Error uploading resume:", err);
      setMessage({
        text: err.response?.data?.message || "Failed to update resume. Try again.",
        isError: true
      });
    } finally {
      setSaving(false);
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
    <div className="max-w-md mx-auto bg-gray-900 dark:bg-white border border-gray-800 dark:border-gray-200 rounded-2xl p-8 shadow-xl dark:shadow-md space-y-6">
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

      <div>
        <h3 className="text-lg font-bold text-white dark:text-gray-900">Resume Document</h3>
        <p className="text-gray-400 dark:text-gray-600 text-xs mt-1">Upload and replace your PDF resume on the homepage</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File preview */}
        <div className="bg-gray-950 dark:bg-gray-50 border border-gray-800 dark:border-gray-200 rounded-xl p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-3 bg-red-950/20 dark:bg-red-50 border border-red-900/30 dark:border-red-200 text-red-400 dark:text-red-600 rounded-xl">
              <FaFilePdf className="text-xl" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider">Current File</p>
              <p className="text-sm text-white dark:text-gray-800 font-medium truncate">
                {resumeUrl ? resumeUrl.split("/").pop() : "No file found"}
              </p>
            </div>
          </div>
          {resumeUrl && (
            <a
              href={`http://localhost:5001${resumeUrl}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-yellow-400 dark:text-blue-600 hover:text-yellow-355 dark:hover:text-blue-700 font-bold transition"
            >
              View PDF
            </a>
          )}
        </div>

        {/* Upload dropzone design */}
        <label className="border-2 border-gray-800 dark:border-gray-300 border-dashed hover:border-yellow-400/40 dark:hover:border-blue-500/40 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition bg-gray-950 dark:bg-gray-50 group">
          <FaCloudUploadAlt className="text-4xl text-gray-500 dark:text-gray-400 group-hover:text-yellow-400 dark:group-hover:text-blue-500 transition mb-3" />
          <p className="text-sm font-bold text-white dark:text-gray-800">Click to select resume PDF</p>
          <p className="text-xs text-gray-500 dark:text-gray-450 mt-1">Accepts only application/pdf files up to 20MB</p>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {selectedFile && (
          <div className="flex items-center justify-between p-3 bg-yellow-400/10 dark:bg-blue-50 border border-yellow-400/20 dark:border-blue-200 rounded-xl">
            <span className="text-xs text-yellow-400 dark:text-blue-600 font-semibold truncate max-w-[80%]">
              Selected: {selectedFile.name}
            </span>
            <button
              type="button"
              onClick={() => setSelectedFile(null)}
              className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-800 p-1"
            >
              <FaTimes />
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={saving || !selectedFile}
          className="w-full flex items-center justify-center gap-2 bg-yellow-400 dark:bg-blue-600 text-gray-950 dark:text-white hover:bg-yellow-500 dark:hover:bg-blue-700 font-bold py-3.5 px-6 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg active:scale-95 text-sm"
        >
          {saving ? (
            <span className="w-5 h-5 border-2 border-gray-950 dark:border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <>
              <FaSave />
              Upload Resume
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ResumeEditor;
