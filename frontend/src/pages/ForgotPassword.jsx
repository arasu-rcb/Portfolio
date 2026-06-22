import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await API.post("/admin/request-password-reset", { email });
      setMessage(response.data.message || "Password reset OTP sent successfully.");
      setTimeout(() => {
        navigate("/admin/reset-password", { state: { email } });
      }, 1200);
    } catch (err) {
      console.error("[Forgot Password Error]", err);
      setError(err.response?.data?.message || "Failed to send password reset OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 dark:bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-900 dark:bg-white border border-gray-800 dark:border-gray-200 rounded-2xl shadow-2xl p-8 space-y-6">
        <button
          onClick={() => navigate("/admin")}
          className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white dark:text-gray-500 dark:hover:text-gray-900 transition"
        >
          <FaArrowLeft /> Back to login
        </button>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-white dark:text-gray-900 tracking-tight">Forgot Password</h2>
          <p className="text-gray-400 dark:text-gray-600 mt-2 text-sm">Enter your admin email to receive an OTP and reset your password.</p>
        </div>

        {error && (
          <div className="bg-red-950/50 dark:bg-red-50 border border-red-900 dark:border-red-200 text-red-400 dark:text-red-600 text-sm p-3 rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-950/50 dark:bg-green-50 border border-green-900 dark:border-green-200 text-green-400 dark:text-green-600 text-sm p-3 rounded-lg text-center font-medium">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 dark:text-gray-600 uppercase tracking-wider">Email Address</label>
            <div className="flex items-center gap-3 border border-gray-800 dark:border-gray-300 rounded-lg px-4 py-3 bg-gray-950 dark:bg-gray-50 transition">
              <FaEnvelope className="text-gray-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="arasumurali014@gmail.com"
                className="bg-transparent w-full outline-none text-gray-200 dark:text-gray-800 placeholder-gray-600 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 dark:bg-blue-600 hover:bg-yellow-500 dark:hover:bg-blue-700 text-gray-950 dark:text-white font-bold py-3.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
