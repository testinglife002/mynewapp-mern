// template.model.js
import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  thumbnailUrl: { type: String },
  width: { type: Number, default: 1080 },
  height: { type: Number, default: 1080 },
  background: { type: String, default: '#ffffff' },
  elements: { type: Array, default: [] },
}, { timestamps: true });

const Template = mongoose.model('Template', templateSchema);
export default Template;