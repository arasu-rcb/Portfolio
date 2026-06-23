import Skill from "../models/skill.js";

// Get All Skills
export const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ createdAt: 1 });
    return res.status(200).json(skills);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create New Skill
export const createSkill = async (req, res) => {
  try {
    const { name, percentage, category, icon } = req.body;

    if (!name || percentage === undefined) {
      return res.status(400).json({ message: "Skill name and percentage are required" });
    }

    const newSkill = new Skill({
      name,
      percentage: Number(percentage),
      category: category || "Web Development",
      icon: icon || "FaTools"
    });

    await newSkill.save();
    return res.status(201).json({ message: "Skill added successfully", skill: newSkill });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update Skill
export const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, percentage, category, icon } = req.body;

    const skill = await Skill.findById(id);
    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    if (name) skill.name = name;
    if (percentage !== undefined) skill.percentage = Number(percentage);
    if (category) skill.category = category;
    if (icon !== undefined) skill.icon = icon;

    await skill.save();
    return res.status(200).json({ message: "Skill updated successfully", skill });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
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
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
