import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../utils/api";
import { FaLock, FaCheckCircle, FaUndo, FaSpinner, FaArrowLeft } from "react-icons/fa";

const OtpVerification = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  
  // Timer States
  const [expiryTime, setExpiryTime] = useState(300); // 5 minutes (300 seconds)
  const [resendCooldown, setResendCooldown] = useState(60); // 60 seconds cooldown for resending

  const navigate = useNavigate();
  const location = useLocation();
  const inputRefs = useRef([]);

  const email = location.state?.email || "";

  // Redirect back to login if email is not present in history state
  useEffect(() => {
    if (!email) {
      navigate("/admin");
    }
  }, [email, navigate]);

  // Main OTP expiration timer
  useEffect(() => {
    if (expiryTime <= 0) return;
    const timer = setInterval(() => {
      setExpiryTime((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [expiryTime]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Helper to format remaining seconds as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Handle single digit inputs
  const handleChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, ""); // Keep only numbers
    if (!value) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1); // Extract last char
    setOtp(newOtp);

    // Auto-focus next input field
    if (index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspaces and navigating key codes
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (otp[index] === "") {
        // Go back and clear previous input
        if (index > 0 && inputRefs.current[index - 1]) {
          inputRefs.current[index - 1].focus();
          newOtp[index - 1] = "";
          setOtp(newOtp);
        }
      } else {
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  // Paste handler
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pastedData)) return; // Ensure it's exactly 6 digits

    const digits = pastedData.split("");
    setOtp(digits);

    // Focus last input field
    if (inputRefs.current[5]) {
      inputRefs.current[5].focus();
    }
  };

  // Submit OTP Verification
  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) {
      setError("Please enter the complete 6-digit OTP code.");
      return;
    }

    if (expiryTime <= 0) {
      setError("OTP Expired");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/admin/verify-otp", {
        email,
        otp: fullOtp
      });

      // Save credentials & redirect to Dashboard
      localStorage.setItem("adminToken", response.data.token);
      localStorage.setItem("adminUser", JSON.stringify(response.data.admin));

      setMessage("Authentication successful!");
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1000);
    } catch (err) {
      console.error("[OTP Verification Error]", err);
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // Request new OTP
  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setError("");
    setMessage("");
    setResending(true);

    try {
      const response = await API.post("/admin/resend-otp", { email });
      setMessage(response.data.message || "OTP resent successfully");
      
      // Reset code fields
      setOtp(new Array(6).fill(""));
      // Focus first field
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }

      // Reset timers
      setExpiryTime(300);
      setResendCooldown(60);
    } catch (err) {
      console.error("[Resend Error]", err);
      setError(err.response?.data?.message || "Failed to resend OTP code.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 dark:bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-900 dark:bg-white border border-gray-800 dark:border-gray-200 rounded-2xl shadow-2xl p-8 space-y-6">
        
        {/* Navigation Link */}
        <button
          onClick={() => navigate("/admin")}
          className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white dark:text-gray-500 dark:hover:text-gray-900 transition"
        >
          <FaArrowLeft /> Back to login
        </button>

        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 bg-yellow-400/10 dark:bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-400 dark:text-blue-600">
            <FaLock className="text-xl" />
          </div>
          <h2 className="text-2xl font-bold text-white dark:text-gray-900 tracking-tight">Security Verification</h2>
          <p className="text-gray-400 dark:text-gray-600 mt-2 text-sm">
            We sent a 6-digit verification code to
          </p>
          <p className="text-yellow-400 dark:text-blue-600 text-sm font-semibold mt-1">
            {email}
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-950/50 dark:bg-red-50 border border-red-900 dark:border-red-200 text-red-400 dark:text-red-600 text-sm p-3 rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-950/50 dark:bg-green-50 border border-green-900 dark:border-green-200 text-green-400 dark:text-green-600 text-sm p-3 rounded-lg text-center font-medium flex items-center justify-center gap-2">
            <FaCheckCircle className="text-green-400 dark:text-green-600" />
            {message}
          </div>
        )}

        {/* OTP Entry fields */}
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-between gap-2.5" onPaste={handlePaste}>
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                ref={(el) => (inputRefs.current[index] = el)}
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-14 text-center text-xl font-bold rounded-xl border bg-gray-950 dark:bg-gray-50 border-gray-800 dark:border-gray-300 text-white dark:text-gray-900 outline-none focus:border-yellow-400 dark:focus:border-blue-600 transition"
              />
            ))}
          </div>

          {/* Expiration Timer Indicator */}
          <div className="text-center text-xs">
            {expiryTime > 0 ? (
              <p className="text-gray-400 dark:text-gray-600">
                Code expires in: <span className="font-semibold text-white dark:text-gray-900">{formatTime(expiryTime)}</span>
              </p>
            ) : (
              <p className="text-red-400 font-semibold">OTP Expired</p>
            )}
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading || expiryTime <= 0}
            className="w-full flex items-center justify-center gap-2 bg-yellow-400 dark:bg-blue-600 hover:bg-yellow-500 dark:hover:bg-blue-700 text-gray-950 dark:text-white font-bold py-3.5 rounded-lg transition transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? <FaSpinner className="animate-spin text-lg" /> : "Verify Code"}
          </button>
        </form>

        {/* Resend Cooldown Controls */}
        <div className="text-center pt-2">
          <button
            onClick={handleResend}
            disabled={resendCooldown > 0 || resending}
            className="inline-flex items-center gap-2 text-xs font-semibold text-yellow-400 hover:text-yellow-300 dark:text-blue-600 dark:hover:text-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {resending ? (
              <>
                <FaSpinner className="animate-spin" /> Resending Code...
              </>
            ) : resendCooldown > 0 ? (
              <>
                <FaUndo className="text-[10px]" /> Resend OTP in {resendCooldown}s
              </>
            ) : (
              <>
                <FaUndo className="text-[10px]" /> Resend OTP Code
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default OtpVerification;
