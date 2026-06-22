import Contact from "../models/contact.js";
import nodemailer from "nodemailer";

// Helper function to send contact message email in the background
const sendContactEmailAsync = async (messageData) => {
  const { name, email, phone, message } = messageData;
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    EMAIL_TO,
    RESEND_API_KEY
  } = process.env;

  const recipient = EMAIL_TO || "arasumurali014@gmail.com";

  // 1. Try Resend HTTP API first if key exists (avoids SMTP port block on Render)
  if (RESEND_API_KEY) {
    try {
      console.log("[Contact Mail] Resend API Key detected, sending via HTTP API...");
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: "Portfolio Message <onboarding@resend.dev>",
          to: recipient,
          subject: `New contact message from ${name}`,
          html: `<p>You received a new message from your portfolio site:</p>
                 <p><strong>Name:</strong> ${name}</p>
                 <p><strong>Email:</strong> ${email}</p>
                 <p><strong>Phone:</strong> ${phone}</p>
                 <p><strong>Message:</strong><br/>${message.replace(/\n/g, "<br/>")}</p>`
        })
      });

      if (res.ok) {
        const data = await res.json();
        console.log("[Contact Mail] Sent successfully via Resend API, ID:", data.id);
        return { success: true, method: "resend" };
      } else {
        const errText = await res.text();
        console.error("[Contact Mail] Resend API error:", errText);
      }
    } catch (apiError) {
      console.error("[Contact Mail] Resend API call failed:", apiError.message);
    }
  }

  // 2. Fall back to SMTP Nodemailer
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.warn("[Contact Mail] SMTP not configured - skipping email send");
    return { success: false, reason: "SMTP credentials not configured" };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT, 10),
      secure: Number(SMTP_PORT) === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000
    });

    console.log("[Contact Mail] Verifying SMTP connection to", SMTP_HOST, "port", SMTP_PORT);
    await transporter.verify();
    console.log("[Contact Mail] SMTP connection successful");

    const mailOptions = {
      from: `${name} <${SMTP_USER}>`,
      to: recipient,
      subject: `New contact message from ${name}`,
      text: `You received a new message from your portfolio site:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage:\n${message}`,
      html: `<p>You received a new message from your portfolio site:</p>
             <p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Phone:</strong> ${phone}</p>
             <p><strong>Message:</strong><br/>${message.replace(/\n/g, "<br/>")}</p>`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Contact Mail] SMTP sent successfully: messageId=${info.messageId}`);
    return { success: true, method: "smtp" };
  } catch (smtpError) {
    console.error("[Contact Mail] SMTP fallback failed:", smtpError.message);
    return { success: false, reason: smtpError.message };
  }
};

export const saveMessage = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    console.log(`[Contact] Incoming message from: ${name} <${email}>, Phone: ${phone}`);

    if (!name || !email || !phone || !message) {
      console.warn("[Contact] Validation failed - missing fields");
      return res.status(400).json({ message: "All fields required" });
    }

    // Save message to DB
    const newMessage = new Contact({ name, email, phone, message });
    await newMessage.save();
    console.log(`[Contact] Saved message ID: ${newMessage._id}`);

    // Trigger email send in background (asynchronously)
    sendContactEmailAsync(newMessage).catch((err) => {
      console.error("[Contact] Background email dispatch failed with error:", err.message);
    });

    return res.status(201).json({
      success: true,
      message: "Message sent and email delivery queued"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all contact messages (Admin only)
export const getMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    return res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete a contact message by ID (Admin only)
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Contact.findById(id);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    await Contact.findByIdAndDelete(id);
    return res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
