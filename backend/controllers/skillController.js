import Skill from "../models/skill.js";

// Get All Skills
export const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ createdAt: 1 });
    return res.status(200).json(skills);
  } catch (error) {
    console.error("[Skill Controller] Get error:", error.message);
    res.status(500).json({ message: "Server error retrieving skills" });
  }
};

// Create New Skill
export const createSkill = async (req, res) => {
  try {
    const { name, percentage, category } = req.body;

    if (!name || percentage === undefined) {
      return res.status(400).json({ message: "Skill name and percentage are required" });
    }

    const newSkill = new Skill({
      name,
      percentage: Number(percentage),
      category: category || "Web Development"
    });

    await newSkill.save();
    return res.status(201).json({ message: "Skill added successfully", skill: newSkill });
  } catch (error) {
    console.error("[Skill Controller] Create error:", error.message);
    res.status(500).json({ message: "Server error adding skill" });
  }
};

// Update Skill
export const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, percentage, category } = req.body;

    const skill = await Skill.findById(id);
    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    if (name) skill.name = name;
    if (percentage !== undefined) skill.percentage = Number(percentage);
    if (category) skill.category = category;

    await skill.save();
    return res.status(200).json({ message: "Skill updated successfully", skill });
  } catch (error) {
    console.error("[Skill Controller] Update error:", error.message);
    res.status(500).json({ message: "Server error updating skill" });
  }
};

// Delete Skill
export const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const skill = await Skill.findById(id);

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    await Skill.findByIdAndDelete(id);
    return res.status(200).json({ message: "Skill deleted successfully" });
  } catch (error) {
    console.error("[Skill Controller] Delete error:", error.message);
    res.status(500).json({ message: "Server error deleting skill" });
  }
};
