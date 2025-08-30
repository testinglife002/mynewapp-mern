// projectDesign.model.js
import mongoose from 'mongoose';

const projectDesignSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  thumbnailUrl: { type: String },
}, { timestamps: true });

const ProjectDesign =  mongoose.model('ProjectDesign', projectDesignSchema);
export default ProjectDesign;
