import nodemailer from "nodemailer";

/**
 * Sends an email notification to the administrator requesting confirmation of a portfolio change.
 * @param {Object} pending - The PendingUpdate Mongoose document
 * @returns {Promise<boolean>}
 */
export const sendApprovalMail = async (pending) => {
  try {
    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const port = parseInt(process.env.SMTP_PORT || "465", 10);
    const user = process.env.EMAIL_USER || process.env.SMTP_USER;
    const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

    if (!user || !pass) {
      console.error("[Approval Mail] SMTP credentials not set up.");
      return false;
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass
      }
    });

    const backendUrl = "http://localhost:5001";
    const approveUrl = `${backendUrl}/api/admin/approve-update?token=${pending.token}`;
    const rejectUrl = `${backendUrl}/api/admin/reject-update?token=${pending.token}`;

    // Helper to format update data as HTML table rows
    let dataRows = "";
    if (pending.updateData && typeof pending.updateData === "object") {
      Object.entries(pending.updateData).forEach(([key, val]) => {
        if (key === "order" || key === "password") return; // Skip non-obvious or security items
        const displayVal = typeof val === "object" ? JSON.stringify(val) : String(val);
        dataRows += `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #4a5568; width: 150px; text-transform: capitalize;">${key}</td>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #2d3748;">${displayVal}</td>
          </tr>
        `;
      });
    }

    if (pending.fileDetails) {
      dataRows += `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #4a5568;">Uploaded File</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #3182ce; font-family: monospace;">${pending.fileDetails.path}</td>
        </tr>
      `;
    }

    const mailOptions = {
      from: `"Portfolio Admin Control" <${user}>`,
      to: "arasumurali014@gmail.com",
      subject: `[Approval Required] Proposed Portfolio Change - ${pending.modelName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <h2 style="color: #2b6cb0; text-align: center; border-bottom: 2px solid #ebf8ff; padding-bottom: 15px; margin-top: 0;">Portfolio Update Request</h2>
          
          <p style="color: #4a5568; font-size: 15px; line-height: 1.6; text-align: center;">
            An administrative update is requested for the <strong>${pending.modelName}</strong> collection.
          </p>

          <div style="background-color: #f7fafc; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #edf2f7;">
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #718096;"><strong>Action Type:</strong> <span style="background-color: #e2e8f0; color: #4a5568; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 12px;">${pending.action}</span></p>
            <p style="margin: 0; font-size: 14px; color: #718096;"><strong>Request Time:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <h3 style="color: #4a5568; font-size: 16px; margin-bottom: 10px;">Proposed Details:</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 14px;">
            <thead>
              <tr style="background-color: #edf2f7;">
                <th style="text-align: left; padding: 10px; border-bottom: 2px solid #cbd5e0; color: #4a5568;">Field</th>
                <th style="text-align: left; padding: 10px; border-bottom: 2px solid #cbd5e0; color: #4a5568;">Value</th>
              </tr>
            </thead>
            <tbody>
              ${dataRows || '<tr><td colspan="2" style="padding: 15px; text-align: center; color: #a0aec0; font-style: italic;">No specific text fields modified</td></tr>'}
            </tbody>
          </table>

          <div style="text-align: center; margin: 30px 0 15px 0;">
            <a href="${approveUrl}" style="display: inline-block; background-color: #38a169; color: white; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px; margin: 0 10px; box-shadow: 0 4px 6px rgba(56, 161, 105, 0.2);">
              Approve & Publish
            </a>
            <a href="${rejectUrl}" style="display: inline-block; background-color: #e53e3e; color: white; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px; margin: 0 10px; box-shadow: 0 4px 6px rgba(229, 62, 62, 0.2);">
              Reject & Discard
            </a>
          </div>

          <p style="color: #a0aec0; font-size: 12px; text-align: center; margin-top: 30px; border-top: 1px solid #edf2f7; padding-top: 15px;">
            Portfolio Administration System • Secure Email Workflow
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Approval Mail] Request sent for ${pending.modelName} (${pending.action}). Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error("[Approval Mail] Failed to dispatch email:", error.message);
    return false;
  }
};
