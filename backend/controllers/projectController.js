const Project = require("../models/projectModel");
const User = require("../models/userModel");

// Create a new project
const createProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id;

    // Check if user already has 4 projects
    const userWithProjects = await User.findById(userId);
    const projectCount = await Project.countDocuments({ userId });
    
    if (projectCount >= 4) {
      return res.status(400).json({ 
        message: "You have reached the maximum limit of 4 projects" 
      });
    }

    const newProject = await Project.create({
      title,
      description,
      userId
    });

    // Add project to user's projects array
    await User.findByIdAndUpdate(
      userId,
      { $push: { projects: newProject._id } },
      { new: true }
    );

    res.status(201).json({
      message: "Project created successfully",
      project: newProject
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error creating project", 
      error: error.message 
    });
  }
};

// Get all projects for a user
const getProjects = async (req, res) => {
  try {
    const userId = req.user.id;
    const projects = await Project.find({ userId });

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching projects", 
      error: error.message 
    });
  }
};

// Get a project by ID
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const project = await Project.findOne({ _id: id, userId });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching project", 
      error: error.message 
    });
  }
};

// Update a project
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const userId = req.user.id;

    // Check if project exists and belongs to the user
    const project = await Project.findOne({ _id: id, userId });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );

    res.status(200).json({
      message: "Project updated successfully",
      project: updatedProject
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error updating project", 
      error: error.message 
    });
  }
};

// Delete a project
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if project exists and belongs to the user
    const project = await Project.findOne({ _id: id, userId });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await Project.findByIdAndDelete(id);

    // Remove project from user's projects array
    await User.findByIdAndUpdate(
      userId,
      { $pull: { projects: id } },
      { new: true }
    );

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ 
      message: "Error deleting project", 
      error: error.message 
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject
}; 