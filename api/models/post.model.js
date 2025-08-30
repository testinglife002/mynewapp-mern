// src/models/post.model.js
import mongoose from "mongoose";

const BlockSchema = new mongoose.Schema(
    { type: Object },
    { _id: false }
);

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    trending: { type: String, enum: ["yes", "no"], default: "no" },
    description: { type: String, required: true },
    blocks: { type: [BlockSchema], default: [] },
    content: { type: String, default: null },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    categoryTitle: { type: String },
    subcategoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    subcategoryTitle: { type: String },
    tags: [String],
    hashtags: [String],
    images: [String], // store image URLs
    primaryImg: String,
    audioUrl: String,
    videoUrl: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    author: String,
    status: { type: String, enum: ["draft", "published"], default: "published" },
    scheduledDate: Date,
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;