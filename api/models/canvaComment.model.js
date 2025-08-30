// canvaComment.model.js
import mongoose from 'mongoose';

const canvaCommentSchema = new mongoose.Schema({
  design: { type: mongoose.Schema.Types.ObjectId, ref: 'Designs', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  targetElementId: { type: String },
  resolved: { type: Boolean, default: false },
}, { timestamps: true });

 const CanvaComment = mongoose.model('CanvaComment', canvaCommentSchema);
export default CanvaComment;
