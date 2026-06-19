import Experience from "../models/experience.js";
import fs from "fs";
import path from "path";

// Get All Experiences
export const getExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ createdAt: -1 });
    return res.status(200).json(experiences);
  } catch (error) {
    console.error("[Experience Controller] Get error:", error.message);
    res.status(500).json({ message: "Server error retrieving experiences" });
  }
};

// Create Experience
export const createExperience = async (req, res) => {
  try {
    const { company, role, duration, description, type } = req.body;

    if (!company || !role || !duration || !type) {
      return res.status(400).json({ message: "Company, role, duration, and type are required" });
    }

    let certificateUrl = "";
    if (req.file) {
      certificateUrl = `/uploads/resume/${req.file.filename}`;
    }

    const newExperience = new Experience({
      company,
      role,
      duration,
      description: description || "",
      type,
      certificateUrl
    });

    await newExperience.save();
    return res.status(201).json({ message: "Experience created successfully", experience: newExperience });
  } catch (error) {
    console.error("[Experience Controller] Create error:", error.message);
    res.status(500).json({ message: "Server error creating experience" });
  }
};

// Update Experience
export const updateExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const { company, role, duration, description, type } = req.body;

    const experience = await Experience.findById(id);
    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    if (company) experience.company = company;
    if (role) experience.role = role;
    if (duration) experience.duration = duration;
    if (description !== undefined) experience.description = description;
    if (type) experience.type = type;

    if (req.file) {
      // Delete old file
      if (experience.certificateUrl) {
        const oldPath = path.join(process.cwd(), experience.certificateUrl);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      experience.certificateUrl = `/uploads/resume/${req.file.filename}`;
    }

    await experience.save();
    return res.status(200).json({ message: "Experience updated successfully", experience });
  } catch (error) {
    console.error("[Experience Controller] Update error:", error.message);
    res.status(500).json({ message: "Server error updating experience" });
  }
};

// Delete Experience
export const deleteExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const experience = await Experience.findById(id);

    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    // Delete associated PDF certificate from disk
    if (experience.certificateUrl) {
      const oldPath = path.join(process.cwd(), experience.certificateUrl);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    await Experience.findByIdAndDelete(id);
    return res.status(200).json({ message: "Experience deleted successfully" });
  } catch (error) {
    console.error("[Experience Controller] Delete error:", error.message);
    res.status(500).json({ message: "Server error deleting experience" });
  }
};
