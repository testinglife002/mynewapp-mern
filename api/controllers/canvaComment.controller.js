import CanvaComment from '../models/canvaComment.model.js';

export const listComments = async (req, res) => {
  const { designId } = req.params;
  const items = await CanvaComment.find({ design: designId }).populate('author', 'username').sort({ createdAt: 1 });
  res.json(items);
};

export const createComment = async (req, res) => {
  // console.log(req.body);
  const { designId } = req.params;
  const { text, targetElementId } = req.body;
  const item = await CanvaComment.create({ design: designId, author: req.userId, text, targetElementId });
  res.json(item);
};

export const resolveComment = async (req, res) => {
  const { id } = req.params;
  const item = await CanvaComment.findByIdAndUpdate(id, { resolved: true }, { new: true });
  res.json(item);
};
