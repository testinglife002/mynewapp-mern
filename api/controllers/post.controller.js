// server/controllers/post.controller.js
import Post from '../models/post.model.js';
import Category from '../models/category.model.js';
// import Post from "../models/Post.js";

// Create new post
// Create new post
export const createPost = async (req, res) => {
  // console.log("📩 Incoming request body:", req.body);
  // console.log("📩 Incoming user (JWT):", req.user); // if using verifyToken
  try {
    const {
      title,
      description,
      content,
      blocks,
      tags,
      hashtags,
      status,
      scheduledDate,
      trending,
      category,
      subcategory,
      author,
      userId,
    } = req.body;

    // Debug IDs
    // console.log("Category ID:", category, "Subcategory ID:", subcategory);

    // Validate and fetch category
    const cat = await Category.findById(category);
    if (!cat) return res.status(400).json({ error: "Invalid category" });

    let subcat = null;
    if (subcategory) {
      subcat = await Category.findById(subcategory);
      if (!subcat) return res.status(400).json({ error: "Invalid subcategory" });
    }

    const post = new Post({
      title,
      description,
      content,
      blocks,
      tags,
      hashtags,
      status,
      scheduledDate,
      trending,
      categoryId: cat._id,
      categoryTitle: cat.name,
      subcategoryId: subcat?._id || null,
      subcategoryTitle: subcat?.name || null,
      author,
      userId,
    });

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: "Failed to create post", error: err.message });
  }
};

// Get all posts
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
                         // .populate("category", "name slug")
                         // .populate("subcategory", "name slug")
                          .sort({ createdAt: -1 }); 
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch posts", error: err.message });
  }
};

// Get single post
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
                               // .populate("category", "name slug")
                               // .populate("subcategory", "name slug");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch post", error: err.message });
  }
};

// Update post
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true })
                                                        .populate("category", "name slug")
                                                        .populate("subcategory", "name slug");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Failed to update post", error: err.message });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete post", error: err.message });
  }
};
