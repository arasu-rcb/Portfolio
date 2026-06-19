import crypto from "crypto";

/**
 * Generates a random 6-digit numeric OTP string
 * @returns {string}
 */
export const generateOtp = () => {
  // Generates a cryptographically strong random value between 100000 and 999999
  const otpVal = crypto.randomInt(100000, 1000000);
  return otpVal.toString();
};
