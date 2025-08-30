import ProjectDesign from '../models/projectDesign.model.js';
import Designs from '../models/designs.model.js';


export const getDesign = async (req, res) => {
  const d = await Designs.findById(req.params.id);
  if (!d) return res.status(404).json({ message: 'Not found' });
  res.json(d);
};

export const updateDesign = async (req, res) => {
  const { id } = req.params;
  const { name, width, height, background, elements } = req.body;
  const updated = await Designs.findByIdAndUpdate(
    id,
    { name, width, height, background, elements },
    { new: true }
  );
  // Optionally update project thumbnail later
  res.json(updated);
};

export const createFromTemplate = async (req, res) => {
  const { projectId } = req.params;
  const { template } = req.body;
  const d = await Designs.create({ project: projectId, ...template });
  res.json(d);
};
