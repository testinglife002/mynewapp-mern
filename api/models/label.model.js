import mongoose from 'mongoose';

const labelSchema = new mongoose.Schema({
  title: { type: String, required: true },
  color: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Label', labelSchema);
