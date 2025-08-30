// src/models/design.model.js
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const designSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    elements: { type: Array, default: [] }, // stores shapes, texts, images, etc.
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    json: mongoose.Schema.Types.Mixed, // store shapes array
    thumbnail: { type: String, required: false }, // small dataURL or S3 key
  },
  { timestamps: true }
);

const Design = mongoose.model("Design", designSchema);
export default Design;