import Project from "../models/project.js";
import fs from "fs";
import path from "path";

// Get All Projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    return res.status(200).json(projects);
  } catch (error) {
    console.error("[Project Controller] Get error:", error.message);
    res.status(500).json({ message: "Server error retrieving projects" });
  }
};

// Create New Project
export const createProject = async (req, res) => {
  try {
    const { title, description, github, techStack, liveLink, order } = req.body;

    if (!title || !description || !github) {
      return res.status(400).json({ message: "Title, description, and GitHub link are required" });
    }

    let image = "";
    if (req.file) {
      image = `/uploads/images/${req.file.filename}`;
    } else {
      return res.status(400).json({ message: "Project preview image is required" });
    }

    // Parse techStack if it is stringified from Form Data
    let parsedTechStack = [];
    if (techStack) {
      if (typeof techStack === "string") {
        try {
          parsedTechStack = JSON.parse(techStack);
        } catch {
          parsedTechStack = techStack.split(",").map(t => t.trim()).filter(Boolean);
        }
      } else if (Array.isArray(techStack)) {
        parsedTechStack = techStack;
      }
    }

    let projectOrder = Number(order);
    if (isNaN(projectOrder)) {
      const lastProject = await Project.findOne().sort({ order: -1 });
      projectOrder = lastProject ? lastProject.order + 1 : 0;
    }

    const newProject = new Project({
      title,
      description,
      image,
      github,
      techStack: parsedTechStack,
      liveLink: liveLink || "",
      order: projectOrder
    });

    await newProject.save();
    return res.status(201).json({ message: "Project created successfully", project: newProject });
  } catch (error) {
    console.error("[Project Controller] Create error:", error.message);
    res.status(500).json({ message: "Server error creating project" });
  }
};

// Update Project
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, github, techStack, liveLink, order } = req.body;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (title) project.title = title;
    if (description) project.description = description;
    if (github) project.github = github;
    if (liveLink !== undefined) project.liveLink = liveLink;

    if (order !== undefined) {
      const parsedOrder = Number(order);
      if (!isNaN(parsedOrder)) {
        project.order = parsedOrder;
      }
    }

    if (techStack) {
      let parsedTechStack = [];
      if (typeof techStack === "string") {
        try {
          parsedTechStack = JSON.parse(techStack);
        } catch {
          parsedTechStack = techStack.split(",").map(t => t.trim()).filter(Boolean);
        }
      } else if (Array.isArray(techStack)) {
        parsedTechStack = techStack;
      }
      project.techStack = parsedTechStack;
    }

    if (req.file) {
      // Delete old local file if it exists and is not empty
      if (project.image) {
        const oldPath = path.join(process.cwd(), project.image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      project.image = `/uploads/images/${req.file.filename}`;
    }

    await project.save();
    return res.status(200).json({ message: "Project updated successfully", project });
  } catch (error) {
    console.error("[Project Controller] Update error:", error.message);
    res.status(500).json({ message: "Server error updating project" });
  }
};

// Delete Project
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Delete associated image file from disk
    if (project.image) {
      const oldPath = path.join(process.cwd(), project.image);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    await Project.findByIdAndDelete(id);
    return res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("[Project Controller] Delete error:", error.message);
    res.status(500).json({ message: "Server error deleting project" });
  }
};

// Reorder Projects
export const reorderProjects = async (req, res) => {
  try {
    const { order } = req.body;
    if (!Array.isArray(order)) {
      return res.status(400).json({ message: "Order must be an array of project IDs" });
    }

    const promises = order.map((id, index) =>
      Project.findByIdAndUpdate(id, { order: index }, { new: true })
    );
    await Promise.all(promises);

    return res.status(200).json({ message: "Projects reordered successfully" });
  } catch (error) {
    console.error("[Project Controller] Reorder error:", error.message);
    res.status(500).json({ message: "Server error reordering projects" });
  }
};
