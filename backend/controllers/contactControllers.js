import Contact from "../models/contact.js";
import nodemailer from "nodemailer";

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

    // Prepare email transport
    // Required env vars: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_TO
    const {
      SMTP_HOST,
      SMTP_PORT,
      SMTP_USER,
      SMTP_PASS,
      EMAIL_TO
    } = process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !EMAIL_TO) {
      console.warn("[Contact] SMTP not configured - skipping email send");
      return res.status(201).json({ message: "Message saved (email not sent)" });
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT, 10),
      secure: Number(SMTP_PORT) === 465, // true for 465, false for other ports
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      }
    });

    const mailOptions = {
      from: `${name} <${SMTP_USER}>`,
      to: EMAIL_TO,
      subject: `New contact message from ${name}`,
      text: `You received a new message from your portfolio site:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage:\n${message}`,
      html: `<p>You received a new message from your portfolio site:</p>
             <p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Phone:</strong> ${phone}</p>
             <p><strong>Message:</strong><br/>${message.replace(/\n/g, "<br/>")}</p>`
    };

    // Send email (but don't fail the whole request if email fails)
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`[Contact] Email sent: messageId=${info.messageId}`);
      console.log("SENDED: contact message processed and email sent (or queued)");
      return res.status(201).json({ message: "Message sent and email delivered" });
    } catch (mailError) {
      console.error("[Contact] Email send failed:", mailError);
      console.log("SENDED: contact message processed (email failed)");
      // return success to frontend for demo/workflow purposes
      return res.status(201).json({ message: "Message saved (email failed)" });
    }
  } catch (error) {
    console.error("Error saving message or sending email:", error);
    console.log("SENDED: contact handler encountered an error");
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Get all contact messages (Admin only)
export const getMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    return res.status(200).json(messages);
  } catch (error) {
    console.error("[Contact Controller] Get messages error:", error.message);
    res.status(500).json({ message: "Server error retrieving messages" });
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
    console.error("[Contact Controller] Delete message error:", error.message);
    res.status(500).json({ message: "Server error deleting message" });
  }
};
