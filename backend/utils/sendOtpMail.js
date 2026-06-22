import nodemailer from "nodemailer";

/**
 * Sends a 6-digit OTP code to the administrator email address.
 * @param {string} toEmail - Target admin email address
 * @param {string} otpCode - The 6-digit OTP code
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export const sendOtpMail = async (toEmail, otpCode) => {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const user = process.env.EMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS;
  const destinationEmail = process.env.ADMIN_EMAIL || toEmail;

  console.log("[OTP Mail] SMTP config detected:", {
    host,
    port,
    userConfigured: !!user,
    passConfigured: !!pass,
    destinationEmail,
    adminEmailEnv: !!process.env.ADMIN_EMAIL,
    emailUserEnv: !!process.env.EMAIL_USER,
    smtpUserEnv: !!process.env.SMTP_USER,
    emailPassEnv: !!process.env.EMAIL_PASS,
    smtpPassEnv: !!process.env.SMTP_PASS
  });

  if (!user || !pass) {
    const message = "Email credentials are not configured in environment variables.";
    console.error("[OTP Mail]", message);
    return { success: false, message };
  }

  const buildTransport = (transportPort) => {
    const transport = {
      host,
      port: transportPort,
      secure: transportPort === 465,
      auth: {
        user,
        pass
      },
      tls: {
        rejectUnauthorized: false
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000
    };

    if (host.includes("gmail.com")) {
      transport.service = "gmail";
      transport.secure = transportPort === 465;
      if (transportPort === 587) {
        transport.secure = false;
        transport.requireTLS = true;
      }
    }

    return transport;
  };

  const mailOptions = {
    from: `"Portfolio Admin Portal" <${user}>`,
    to: destinationEmail,
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

  const trySend = async (transportSettings) => {
    const transporter = nodemailer.createTransport(transportSettings);
    await transporter.verify();
    console.log("[OTP Mail] SMTP connection successful");
    const info = await transporter.sendMail(mailOptions);
    return info;
  };

  try {
    const info = await trySend(buildTransport(port));
    console.log(`[OTP Mail] Verification code sent to ${destinationEmail}. Message ID: ${info.messageId}`);
    return { success: true };
  } catch (primaryError) {
    console.error("[OTP Mail] Primary SMTP error:", primaryError);
    console.error("[OTP Mail] Primary SMTP stack:", primaryError.stack);
    const primaryMessage = primaryError?.message || "Unknown SMTP error";
    console.warn("[OTP Mail] Primary SMTP send failed:", primaryMessage);

    if (host.includes("gmail.com") && port === 465) {
      try {
        const fallbackInfo = await trySend(buildTransport(587));
        console.log(`[OTP Mail] Fallback via port 587 succeeded. Message ID: ${fallbackInfo.messageId}`);
        return { success: true };
      } catch (fallbackError) {
        console.error("[OTP Mail] Gmail fallback error:", fallbackError);
        const fallbackMessage = fallbackError?.message || "Unknown SMTP fallback error";
        return { success: false, message: `Primary: ${primaryMessage}; Fallback: ${fallbackMessage}` };
      }
    }

    return { success: false, message: primaryMessage };
  }
};
