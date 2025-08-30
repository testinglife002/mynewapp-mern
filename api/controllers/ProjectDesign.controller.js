import ProjectDesign from '../models/projectDesign.model.js';
import Designs from '../models/designs.model.js';

export const listProjects = async (req, res) => {
  const projects = await ProjectDesign.find({ owner: req.userId }).sort({ updatedAt: -1 });
  res.json(projects);
};

export const createProject = async (req, res) => {
  const project = await ProjectDesign.create({ owner: req.userId, name: req.body.name || 'Untitled' });
  const design = await Designs.create({ project: project._id, name: 'Untitled', elements: [] });
  res.json({ project, design });
};

export const renameProject = async (req, res) => {
  const { id } = req.params;
  const project = await ProjectDesign.findOneAndUpdate({ _id: id, owner: req.userId }, { name: req.body.name }, { new: true });
  res.json(project);
};

export const deleteProject = async (req, res) => {
  const { id } = req.params;
  await Designs.deleteMany({ project: id });
  await ProjectDesign.deleteOne({ _id: id, owner: req.userId });
  res.json({ ok: true });
};
