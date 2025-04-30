const Task = require("../models/taskModel");
const Project = require("../models/projectModel");

// Create a new task
const createTask = async (req, res) => {
  try {
    const { title, description, projectId } = req.body;
    const userId = req.user.id;

    // Check if project exists and belongs to the user
    const project = await Project.findOne({ _id: projectId, userId });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const newTask = await Task.create({
      title,
      description,
      projectId,
      status: "pending",
      createdAt: new Date()
    });

    res.status(201).json({
      message: "Task created successfully",
      task: newTask
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error creating task", 
      error: error.message 
    });
  }
};

// Get all tasks for a project
const getTasks = async (req, res) => {
  try {
    const { projectId } = req.query;
    const userId = req.user.id;

    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required" });
    }

    // Check if project exists and belongs to the user
    const project = await Project.findOne({ _id: projectId, userId });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const tasks = await Task.find({ projectId });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching tasks", 
      error: error.message 
    });
  }
};

// Get a task by ID
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if the task's project belongs to the user
    const project = await Project.findOne({ 
      _id: task.projectId, 
      userId 
    });
    if (!project) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching task", 
      error: error.message 
    });
  }
};

// Update a task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const userId = req.user.id;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if the task's project belongs to the user
    const project = await Project.findOne({ 
      _id: task.projectId, 
      userId 
    });
    if (!project) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updateData = {
      title,
      description,
      status
    };

    // Set completedAt date if status is changed to completed
    if (status === "completed" && task.status !== "completed") {
      updateData.completedAt = new Date();
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error updating task", 
      error: error.message 
    });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if the task's project belongs to the user
    const project = await Project.findOne({ 
      _id: task.projectId, 
      userId 
    });
    if (!project) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Task.findByIdAndDelete(id);

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ 
      message: "Error deleting task", 
      error: error.message 
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
}; 