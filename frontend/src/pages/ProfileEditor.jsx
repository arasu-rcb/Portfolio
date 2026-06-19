import React, { useState, useEffect } from "react";
import API from "../utils/api";
import { FaCamera, FaSave, FaImage } from "react-icons/fa";

const ProfileEditor = () => {
  const [profileImage, setProfileImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", isError: false });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // Fetch current profile image path from about details
  useEffect(() => {
    fetchProfileImage();
  }, []);

  const fetchProfileImage = async () => {
    try {
      const res = await API.get("/about");
      if (res.data && res.data.profileImage) {
        setProfileImage(`http://localhost:5001${res.data.profileImage}`);
      }
    } catch (err) {
      console.error("Error loading profile image:", err);
      setMessage({ text: "Failed to load current profile photo", isError: true });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setMessage({ text: "Please choose a photo file to upload first.", isError: true });
      return;
    }

    setSaving(true);
    setMessage({ text: "", isError: false });

    const data = new FormData();
    data.append("profileImage", selectedFile);

    try {
      const res = await API.put("/about/profile-image", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setMessage({ text: "Profile image updated successfully! ✅", isError: false });
      if (res.data && res.data.about && res.data.about.profileImage) {
        setProfileImage(`http://localhost:5001${res.data.about.profileImage}`);
      }
      setSelectedFile(null);
      setPreviewUrl("");
      setTimeout(() => setMessage({ text: "", isError: false }), 4000);
    } catch (err) {
      console.error("Error uploading profile image:", err);
      setMessage({
        text: err.response?.data?.message || "Failed to update profile image. Try again.",
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
        <h3 className="text-lg font-bold text-white dark:text-gray-900">Profile Photo</h3>
        <p className="text-gray-400 dark:text-gray-600 text-xs mt-1">Change your portfolio homepage avatar photo</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 flex flex-col items-center">
        {/* Photo Container */}
        <div className="relative group">
          <div className="w-44 h-44 rounded-full overflow-hidden border-2 border-gray-800 dark:border-gray-300 group-hover:border-yellow-400 dark:group-hover:border-blue-500 transition shadow-lg bg-gray-950 dark:bg-gray-50">
            {previewUrl ? (
              <img src={previewUrl} alt="New Preview" className="w-full h-full object-cover" />
            ) : profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                <FaImage className="text-4xl" />
              </div>
            )}
          </div>
          <label className="absolute bottom-2 right-2 p-3 bg-yellow-400 dark:bg-blue-600 text-gray-950 dark:text-white hover:bg-yellow-500 dark:hover:bg-blue-700 rounded-full cursor-pointer transition shadow-lg">
            <FaCamera className="text-sm" />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {selectedFile && (
          <p className="text-xs text-yellow-400 dark:text-blue-600 font-semibold animate-pulse">
            Selected: {selectedFile.name} (Ready to upload)
          </p>
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
              Upload Photo
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ProfileEditor;
