import express from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryTree,
  updateCategory,
  deleteCategory,
  updateCategoryBySlug,
  deleteCategoryBySlug,
  getCategoryBySlug
} from '../controllers/category.controller.js';
 import { verifyToken } from "../middleware/jwt.js";
import { verifyAdmin } from '../middleware/verifyAdmin.js';

const router = express.Router();



// ✅ Only admin can create, update, delete
// Create category (Admin only)
router.post("/", verifyToken, verifyAdmin, createCategory);

// GET /api/categories - Get all (flat)
router.get('/', getAllCategories);

// GET /api/categories/tree - Get category tree
router.get('/tree', getCategoryTree);


// Update category by slug (Admin only)
router.put("/:slug", verifyToken, verifyAdmin, updateCategory);
// Delete category by slug (Admin only)
router.delete("/:slug", verifyToken, verifyAdmin, deleteCategory);




// Use slug instead of id in URL param
router.get('/:slug', getCategoryBySlug); // Get single category by slug
// router.put('/:slug', updateCategory);    // Update by slug
// router.delete('/:slug', deleteCategory); // Delete by slug


// PUT /api/categories/:slug - Update category by slug
router.put('/edit/:slug',  updateCategoryBySlug);

// DELETE /api/categories/:slug - Delete category by slug
router.delete('/delete/:slug',  deleteCategoryBySlug);


export default router;
