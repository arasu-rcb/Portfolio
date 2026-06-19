import Education from "../models/education.js";

// Get All Education Timeline Items
export const getEducation = async (req, res) => {
  try {
    const educationList = await Education.find().sort({ createdAt: 1 });
    return res.status(200).json(educationList);
  } catch (error) {
    console.error("[Education Controller] Get error:", error.message);
    res.status(500).json({ message: "Server error retrieving education details" });
  }
};

// Create Education
export const createEducation = async (req, res) => {
  try {
    const { degree, institution, year, cgpa } = req.body;

    if (!degree || !institution || !year || !cgpa) {
      return res.status(400).json({ message: "Degree, institution, year, and CGPA/Score are required" });
    }

    const newEducation = new Education({
      degree,
      institution,
      year,
      cgpa
    });

    await newEducation.save();
    return res.status(201).json({ message: "Education detail added successfully", education: newEducation });
  } catch (error) {
    console.error("[Education Controller] Create error:", error.message);
    res.status(500).json({ message: "Server error adding education detail" });
  }
};

// Update Education
export const updateEducation = async (req, res) => {
  try {
    const { id } = req.params;
    const { degree, institution, year, cgpa } = req.body;

    const education = await Education.findById(id);
    if (!education) {
      return res.status(404).json({ message: "Education detail not found" });
    }

    if (degree) education.degree = degree;
    if (institution) education.institution = institution;
    if (year) education.year = year;
    if (cgpa) education.cgpa = cgpa;

    await education.save();
    return res.status(200).json({ message: "Education detail updated successfully", education });
  } catch (error) {
    console.error("[Education Controller] Update error:", error.message);
    res.status(500).json({ message: "Server error updating education detail" });
  }
};

// Delete Education
export const deleteEducation = async (req, res) => {
  try {
    const { id } = req.params;
    const education = await Education.findById(id);

    if (!education) {
      return res.status(404).json({ message: "Education detail not found" });
    }

    await Education.findByIdAndDelete(id);
    return res.status(200).json({ message: "Education detail deleted successfully" });
  } catch (error) {
    console.error("[Education Controller] Delete error:", error.message);
    res.status(500).json({ message: "Server error deleting education detail" });
  }
};
