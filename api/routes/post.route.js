// server/routes/post.route.js

import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import { createPost, deletePost, getPostById, getPosts, updatePost } from "../controllers/post.controller.js";

const router = express.Router();

router.post("/", verifyToken, createPost);       // Create post
router.get("/", getPosts);          // Get all posts
router.get("/:id", getPostById);    // Get one post
router.put("/:id", verifyToken, updatePost);     // Update post
router.delete("/:id", verifyToken, deletePost);  // Delete post

export default router;
