import Label from '../models/label.model.js';

export const createLabel = async (req, res) => {
  try {
    const label = new Label(req.body);
    await label.save();
    res.status(201).json(label);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllLabels = async (req, res) => {
  try {
    const labels = await Label.find();
    res.status(200).json(labels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
