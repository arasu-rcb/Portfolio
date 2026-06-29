import nodemailer from "nodemailer";

/**
 * Sends a 6-digit OTP code to the administrator email address.
 * @param {string} toEmail - Target admin email address
 * @param {string} otpCode - The 6-digit OTP code
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export const sendOtpMail = async (toEmail, otpCode) => {
  const destinationEmail = process.env.ADMIN_EMAIL || toEmail;

  // 1. Try Resend HTTP API first if key exists (avoids SMTP port block on Render)
  if (process.env.RESEND_API_KEY) {
    try {
      console.log("[OTP Mail] Resend API Key detected, sending via HTTP API...");
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: "Portfolio Security <onboarding@resend.dev>",
          to: destinationEmail,
          subject: "Your Admin Verification OTP Code",
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
                MERN Portfolio Security Layer • Powered by Resend API
              </p>
            </div>
          `
        })
      });

      if (res.ok) {
        const data = await res.json();
        console.log("[OTP Mail] Sent successfully via Resend API, ID:", data.id);
        return { success: true };
      } else {
        const errText = await res.text();
        console.error("[OTP Mail] Resend API error:", errText);
      }
    } catch (apiError) {
      console.error("[OTP Mail] Resend API call failed:", apiError.message);
    }
  }

  // 2. Fall back to SMTP Nodemailer
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.EMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

  console.log("[OTP Mail] Fallback to SMTP config:", {
    host,
    port,
    userConfigured: !!user,
    passConfigured: !!pass,
    destinationEmail
  });

  if (!user || !pass) {
    const message = "Email credentials (EMAIL_USER/SMTP_USER or EMAIL_PASS/SMTP_PASS) are not configured.";
    console.error("[OTP Mail]", message);
    return { success: false, message };
  }

  const buildTransport = (transportPort) => {
    return {
      host,
      port: transportPort,
      secure: transportPort === 465,
      auth: { user, pass },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
      logger: false,
      debug: false
    };
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
    console.log("[OTP Mail] Verifying SMTP connection...");
    await transporter.verify();
    console.log("[OTP Mail] SMTP connection successful");
    console.log("[OTP Mail] Sending mail to:", destinationEmail);
    const info = await transporter.sendMail(mailOptions);
    console.log("[OTP Mail] Mail sent successfully, Message ID:", info.messageId);
    return info;
  };

  try {
    console.log("[OTP Mail] Attempting connection on port", port);
    const info = await trySend(buildTransport(port));
    console.log(`[OTP Mail] Verification code sent to ${destinationEmail}. Message ID: ${info.messageId}`);
    return { success: true };
  } catch (primaryError) {
    console.error("[OTP Mail] Primary SMTP error:", primaryError.message);
    const primaryMessage = primaryError?.message || "Unknown SMTP error";

     if (host.includes("gmail.com") && port === 587) {
      console.log("[OTP Mail] Fallback: Attempting port 465...");
      try {
        const fallbackTransport = buildTransport(465);
        const fallbackInfo = await trySend(fallbackTransport);
        console.log(`[OTP Mail] Fallback via port 465 succeeded. Message ID: ${fallbackInfo.messageId}`);
        return { success: true };
      } catch (fallbackError) {
        console.error("[OTP Mail] Fallback port 465 failed:", fallbackError.message);
        const fallbackMessage = fallbackError?.message || "Port 465 also failed";
        return { success: false, message: `Port 587: ${primaryMessage}; Port 465: ${fallbackMessage}` };
      }
    }

    return { success: false, message: primaryMessage };
  }
};
