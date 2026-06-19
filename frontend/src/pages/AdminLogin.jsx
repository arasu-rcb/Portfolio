import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // If already logged in, redirect straight to dashboard
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await API.post("/admin/login", { email, password });
      
      // Transition to OTP verification step, passing the email in state
      navigate("/admin/otp-verification", { state: { email } });
    } catch (err) {
      console.error("[Login Error]", err);
      setError(
        err.response?.data?.message || 
        "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 dark:bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-900 dark:bg-white border border-gray-800 dark:border-gray-200 rounded-2xl shadow-2xl dark:shadow-md p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white dark:text-gray-900 tracking-tight">Admin Portal</h2>
          <p className="text-gray-400 dark:text-gray-600 mt-2 text-sm">Sign in to manage your portfolio</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-950/50 dark:bg-red-50 border border-red-900 dark:border-red-200 text-red-400 dark:text-red-600 text-sm p-3.5 rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 dark:text-gray-600 uppercase tracking-wider">
              Email Address
            </label>
            <div className="flex items-center gap-3 border border-gray-800 dark:border-gray-300 rounded-lg px-4 py-3 bg-gray-950 dark:bg-gray-50 focus-within:border-yellow-500 dark:focus-within:border-blue-500 transition">
              <FaEnvelope className="text-gray-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@portfolio.com"
                className="bg-transparent w-full outline-none text-gray-200 dark:text-gray-800 placeholder-gray-600 text-sm"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 dark:text-gray-600 uppercase tracking-wider">
              Password
            </label>
            <div className="flex items-center gap-3 border border-gray-800 dark:border-gray-300 rounded-lg px-4 py-3 bg-gray-950 dark:bg-gray-50 focus-within:border-yellow-500 dark:focus-within:border-blue-500 transition">
              <FaLock className="text-gray-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-transparent w-full outline-none text-gray-200 dark:text-gray-800 placeholder-gray-600 text-sm"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-yellow-400 dark:bg-blue-600 hover:bg-yellow-500 dark:hover:bg-blue-700 text-gray-950 dark:text-white font-bold py-3.5 rounded-lg transition transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-gray-950 dark:border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <FaSignInAlt />
                Sign In
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
};

export default AdminLogin;
