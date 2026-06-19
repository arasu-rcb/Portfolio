import About from "../models/about.js";
import fs from "fs";
import path from "path";

// Get About Details
export const getAbout = async (req, res) => {
  try {
    let about = await About.findOne();

    // If no About data exists in the database, return a default template
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
      // Do not save it yet, just return it so it doesn't break the frontend
    }

    return res.status(200).json(about);
  } catch (error) {
    console.error("[About Controller] Get error:", error.message);
    res.status(500).json({ message: "Server error retrieving About details" });
  }
};

// Update/Upsert About Details
export const updateAbout = async (req, res) => {
  try {
    const { name, title, description, email, phone, location, github, linkedin } = req.body;

    if (!name || !title || !description || !email || !phone || !location || !github || !linkedin) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let about = await About.findOne();

    if (about) {
      // Update
      about.name = name;
      about.title = title;
      about.description = description;
      about.email = email;
      about.phone = phone;
      about.location = location;
      about.github = github;
      about.linkedin = linkedin;
      await about.save();
    } else {
      // Create
      about = new About({
        name,
        title,
        description,
        email,
        phone,
        location,
        github,
        linkedin
      });
      await about.save();
    }

    return res.status(200).json({ message: "About section updated successfully", about });
  } catch (error) {
    console.error("[About Controller] Update error:", error.message);
    res.status(500).json({ message: "Server error updating About details" });
  }
};

// Update Profile Image
export const updateProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No profile image uploaded" });
    }
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

    // Delete old profile image if it exists
    if (about.profileImage) {
      const oldPath = path.join(process.cwd(), about.profileImage);
      if (fs.existsSync(oldPath)) {
        try {
          fs.unlinkSync(oldPath);
        } catch (err) {
          console.error("Failed to delete old profile image:", err.message);
        }
      }
    }

    about.profileImage = `/uploads/images/${req.file.filename}`;
    await about.save();
    return res.status(200).json({ message: "Profile image updated successfully", about });
  } catch (error) {
    console.error("[About Controller] Profile image update error:", error.message);
    res.status(500).json({ message: "Server error updating profile image" });
  }
};

// Update Resume
export const updateResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No resume PDF uploaded" });
    }
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

    // Delete old resume PDF if it exists
    if (about.resumeUrl) {
      const oldPath = path.join(process.cwd(), about.resumeUrl);
      if (fs.existsSync(oldPath)) {
        try {
          fs.unlinkSync(oldPath);
        } catch (err) {
          console.error("Failed to delete old resume PDF:", err.message);
        }
      }
    }

    about.resumeUrl = `/uploads/resume/${req.file.filename}`;
    await about.save();
    return res.status(200).json({ message: "Resume updated successfully", about });
  } catch (error) {
    console.error("[About Controller] Resume update error:", error.message);
    res.status(500).json({ message: "Server error updating resume" });
  }
};
