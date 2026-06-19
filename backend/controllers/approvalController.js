import PendingUpdate from "../models/pendingUpdate.js";
import About from "../models/about.js";
import Project from "../models/project.js";
import Skill from "../models/skill.js";
import Experience from "../models/experience.js";
import Education from "../models/education.js";
import fs from "fs";
import path from "path";

/**
 * Handles confirmation and application of the pending modification
 */
export const approveUpdate = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).send("<h1>Error</h1><p>Missing approval token.</p>");
    }

    const pending = await PendingUpdate.findOne({ token });
    if (!pending) {
      return res.status(404).send(`
        <html>
          <head>
            <title>Link Expired</title>
            <style>
              body { font-family: Arial, sans-serif; background-color: #f7fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
              .container { text-align: center; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); max-width: 450px; }
              h1 { color: #e53e3e; }
              p { color: #4a5568; line-height: 1.6; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Action Not Found</h1>
              <p>This update request was already processed, rejected, or does not exist.</p>
            </div>
          </body>
        </html>
      `);
    }

    const { modelName, action, targetId, updateData, fileDetails } = pending;

    if (modelName === "About") {
      let about = await About.findOne();
      if (!about) {
        about = new About({
          name: "Arasu Murali",
          title: "Computer Science Engineer",
          description: "Graduate specializing in Cyber Security and Networking.",
          email: "arasumurali014@gmail.com",
          phone: "8608166921",
          location: "Chennai, India",
          github: "https://github.com/arasu-rcb",
          linkedin: "https://www.linkedin.com/in/arasu-murali/"
        });
      }

      if (fileDetails) {
        const fieldName = fileDetails.fieldname; // "profileImage" or "resume"
        const targetField = fieldName === "resume" ? "resumeUrl" : "profileImage";
        
        // Delete old asset from disk
        if (about[targetField]) {
          const oldPath = path.join(process.cwd(), about[targetField]);
          if (fs.existsSync(oldPath)) {
            try {
              fs.unlinkSync(oldPath);
            } catch (err) {
              console.error("[Approval] Old file delete failed:", err.message);
            }
          }
        }
        about[targetField] = fileDetails.path;
      } else {
        // Plain text updates
        Object.assign(about, updateData);
      }
      await about.save();
    }

    else if (modelName === "Project") {
      if (action === "CREATE") {
        const project = new Project(updateData);
        if (fileDetails) {
          project.image = fileDetails.path;
        }
        await project.save();
      }
      else if (action === "UPDATE") {
        const project = await Project.findById(targetId);
        if (project) {
          if (fileDetails) {
            if (project.image) {
              const oldPath = path.join(process.cwd(), project.image);
              if (fs.existsSync(oldPath)) {
                try { fs.unlinkSync(oldPath); } catch (e) {}
              }
            }
            project.image = fileDetails.path;
          }
          Object.assign(project, updateData);
          await project.save();
        }
      }
      else if (action === "DELETE") {
        const project = await Project.findById(targetId);
        if (project) {
          if (project.image) {
            const oldPath = path.join(process.cwd(), project.image);
            if (fs.existsSync(oldPath)) {
              try { fs.unlinkSync(oldPath); } catch (e) {}
            }
          }
          await Project.findByIdAndDelete(targetId);
        }
      }
      else if (action === "REORDER") {
        const { order } = updateData;
        if (Array.isArray(order)) {
          const promises = order.map((id, index) =>
            Project.findByIdAndUpdate(id, { order: index }, { new: true })
          );
          await Promise.all(promises);
        }
      }
    }

    else if (modelName === "Skill") {
      if (action === "CREATE") {
        const skill = new Skill(updateData);
        await skill.save();
      }
      else if (action === "UPDATE") {
        await Skill.findByIdAndUpdate(targetId, updateData, { new: true });
      }
      else if (action === "DELETE") {
        await Skill.findByIdAndDelete(targetId);
      }
    }

    else if (modelName === "Experience") {
      if (action === "CREATE") {
        const exp = new Experience(updateData);
        if (fileDetails) {
          exp.certificateUrl = fileDetails.path;
        }
        await exp.save();
      }
      else if (action === "UPDATE") {
        const exp = await Experience.findById(targetId);
        if (exp) {
          if (fileDetails) {
            if (exp.certificateUrl) {
              const oldPath = path.join(process.cwd(), exp.certificateUrl);
              if (fs.existsSync(oldPath)) {
                try { fs.unlinkSync(oldPath); } catch (e) {}
              }
            }
            exp.certificateUrl = fileDetails.path;
          }
          Object.assign(exp, updateData);
          await exp.save();
        }
      }
      else if (action === "DELETE") {
        const exp = await Experience.findById(targetId);
        if (exp) {
          if (exp.certificateUrl) {
            const oldPath = path.join(process.cwd(), exp.certificateUrl);
            if (fs.existsSync(oldPath)) {
              try { fs.unlinkSync(oldPath); } catch (e) {}
            }
          }
          await Experience.findByIdAndDelete(targetId);
        }
      }
    }

    else if (modelName === "Education") {
      if (action === "CREATE") {
        const edu = new Education(updateData);
        await edu.save();
      }
      else if (action === "UPDATE") {
        await Education.findByIdAndUpdate(targetId, updateData, { new: true });
      }
      else if (action === "DELETE") {
        await Education.findByIdAndDelete(targetId);
      }
    }

    // Clean up the pending update request
    await PendingUpdate.deleteOne({ _id: pending._id });

    // Render confirm success view
    return res.status(200).send(`
      <html>
        <head>
          <title>Approval Confirmed</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: Arial, sans-serif; background-color: #f7fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
            .container { text-align: center; background: white; padding: 40px 20px; border-radius: 16px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); max-width: 450px; width: 100%; border: 1px solid #e2e8f0; }
            h1 { color: #38a169; font-size: 24px; margin-bottom: 12px; }
            p { color: #4a5568; line-height: 1.6; font-size: 15px; margin-bottom: 25px; }
            .button { display: inline-block; background-color: #3182ce; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px rgba(49, 130, 206, 0.2); transition: background-color 0.2s; }
            .button:hover { background-color: #2b6cb0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div style="font-size: 50px; color: #38a169; margin-bottom: 15px;">✓</div>
            <h1>Change Approved!</h1>
            <p>The proposed modification to the <strong>${modelName}</strong> section has been successfully applied to the live website.</p>
            <a href="http://localhost:5173/admin/dashboard" class="button">Return to Dashboard</a>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("[Approval Confirmation Error]:", error);
    return res.status(500).send(`<h1>Server Error</h1><p>${error.message}</p>`);
  }
};

/**
 * Handles rejection and discard of the pending request
 */
export const rejectUpdate = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).send("<h1>Error</h1><p>Missing rejection token.</p>");
    }

    const pending = await PendingUpdate.findOne({ token });
    if (!pending) {
      return res.status(404).send("<h1>Not Found</h1><p>This update request was already processed or does not exist.</p>");
    }

    // Delete newly uploaded temp file if one was created
    if (pending.fileDetails) {
      const filePath = path.join(process.cwd(), pending.fileDetails.path);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.error("[Rejection] File delete failed:", err.message);
        }
      }
    }

    await PendingUpdate.deleteOne({ _id: pending._id });

    return res.status(200).send(`
      <html>
        <head>
          <title>Action Rejected</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: Arial, sans-serif; background-color: #f7fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
            .container { text-align: center; background: white; padding: 40px 20px; border-radius: 16px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); max-width: 450px; width: 100%; border: 1px solid #e2e8f0; }
            h1 { color: #e53e3e; font-size: 24px; margin-bottom: 12px; }
            p { color: #4a5568; line-height: 1.6; font-size: 15px; margin-bottom: 25px; }
            .button { display: inline-block; background-color: #3182ce; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px rgba(49, 130, 206, 0.2); }
          </style>
        </head>
        <body>
          <div class="container">
            <div style="font-size: 50px; color: #e53e3e; margin-bottom: 15px;">✗</div>
            <h1>Change Discarded</h1>
            <p>The proposed modification request was successfully rejected and removed. No changes were applied.</p>
            <a href="http://localhost:5173/admin/dashboard" class="button">Return to Dashboard</a>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("[Approval Rejection Error]:", error);
    return res.status(500).send(`<h1>Server Error</h1><p>${error.message}</p>`);
  }
};
