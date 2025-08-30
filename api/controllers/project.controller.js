import Project from "../models/project.model.js";
import User from "../models/user.model.js"; // Needed for shareProject

// Create new project
export const createProject = async (req, res) => {
  console.log(req.body);
  try {
    const { name, optionId } = req.body;
    const project = new Project({
      name,
      optionId,
      userId: req.userId,
    });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: "Failed to create project", details: err });
  }
};

// Get all projects for the current user under an option
export const getProjects = async (req, res) => {
  try {
    const { optionId } = req.query;
    const filter = { userId: req.userId };
    if (optionId) filter.optionId = optionId;

    // const projects = await Project.find(filter).sort({ createdAt: -1 });
    const projects = await Project.find(filter)
                            .populate("optionId", "name")
                            .populate("sharedWith", "username email")
                            .sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Failed to get projects", details: err });
  }
};

// Get all projects for a specific option
export const getProjectsByOption = async (req, res) => {
  const { optionId } = req.params;
  try {
    const projects = await Project.find({ optionId, userId: req.userId });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all projects created by the current user
export const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.userId });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Share project with another user by email
export const shareProject = async (req, res) => {
  const { projectId } = req.params;
  const { email } = req.body;

  try {
    const project = await Project.findOne({ _id: projectId, userId: req.userId });
    if (!project) return res.status(404).json({ error: "Project not found" });

    const userToShare = await User.findOne({ email });
    if (!userToShare) return res.status(404).json({ error: "User not found" });

    if (!project.sharedWith.includes(userToShare._id)) {
      project.sharedWith.push(userToShare._id);
      await project.save();
    }

    res.json({ message: "Project shared successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to share project", details: err });
  }
};

// Update a project
export const updateProject = async (req, res) => {
  try {
    const updated = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { name: req.body.name },
      { new: true }
    );
    if (!updated) return res.status(404).json("Project not found or unauthorized");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update project", details: err });
  }
};

// Delete a project
export const deleteProject = async (req, res) => {
  try {
    const deleted = await Project.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!deleted) return res.status(404).json("Project not found or unauthorized");
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete project", details: err });
  }
};
