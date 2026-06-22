import nodemailer from "nodemailer";

/**
 * Sends a 6-digit OTP code to the administrator email address.
 * @param {string} toEmail - Target admin email address
 * @param {string} otpCode - The 6-digit OTP code
 * @returns {Promise<boolean>} - True if sent successfully, false otherwise
 */
export const sendOtpMail = async (toEmail, otpCode) => {
  try {
    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const port = parseInt(process.env.SMTP_PORT || "465", 10);
    const user = process.env.EMAIL_USER || process.env.SMTP_USER;
    const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

    if (!user || !pass) {
      console.error("[OTP Mail] Email credentials are not configured in environment variables.");
      return false;
    }

    const transporter = nodemailer.createTransport({
      service: host.includes("gmail") ? "gmail" : undefined,
      host,
      port,
      secure: port === 465, // true for 465, false for other ports
      auth: {
        user,
        pass
      },
      tls: {
        rejectUnauthorized: false
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
      logger: false,
      debug: false
    });

    const mailOptions = {
      from: `"Portfolio Admin Portal" <${user}>`,
      to: toEmail,
      subject: "Your Admin Verification OTP Code",
      text: `Your admin verification code is: ${otpCode}. It is valid for 5 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
          <h2 style="color: #1a202c; text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Admin Authentication Layer</h2>
          <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
            A login attempt was made for the Admin Panel. To proceed, please use the following 6-digit One-Time Password (OTP) verification code:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #3182ce; background-color: #ebf8ff; padding: 10px 30px; border-radius: 8px; border: 1px dashed #bee3f8;">
              ${otpCode}
            </span>
          </div>
          <p style="color: #e53e3e; font-size: 14px; text-align: center;">
            This OTP is confidential and will expire in <strong>5 minutes</strong>. If you did not initiate this login, please ignore this email.
          </p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 30px;" />
          <p style="color: #a0aec0; font-size: 12px; text-align: center;">
            MERN Portfolio Security Layer • Powered by Nodemailer
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[OTP Mail] Verification code sent to ${toEmail}. Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error("[OTP Mail] Failed to send email:", error.message);
    return false;
  }
};
