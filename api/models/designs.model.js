// designs.model.js
import mongoose from 'mongoose';

const ElementSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, enum: ['rect','circle','text','image','line','group'], required: true },
  attrs: { type: Object, default: {} },
  locked: { type: Boolean, default: false },
  hidden: { type: Boolean, default: false },
}, { _id: false });

const designsSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'ProjectDesign', required: true },
  name: { type: String, required: true },
  width: { type: Number, default: 1080 },
  height: { type: Number, default: 1080 },
  background: { type: String, default: '#ffffff' },
  elements: { type: [ElementSchema], default: [] },
}, { timestamps: true });

const Designs =  mongoose.model('Designs', designsSchema);
export default Designs;
