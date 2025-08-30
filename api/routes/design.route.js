import express from "express";
import multer from "multer";
import { getDesignById, getDesigns, getUserDesigns, updateDesigns, uploadImage } from "../controllers/design.controller.js";
import { getDesign, listDesigns, saveDesign, updateDesign } from "../controllers/design.controller.js";
 import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// CRUD
router.post("/save", verifyToken, saveDesign);
router.get("/", verifyToken, listDesigns);
router.get("/", verifyToken, getDesigns);


router.get("/:id", verifyToken, getDesign);

router.patch("/:id", verifyToken, updateDesign);

// Get all designs by user
router.get("/user/:userId", verifyToken, getUserDesigns);

// Get single design by ID
router.get("/:designId", verifyToken, getDesignById);

// Update / autosave design
router.put("/:designId", verifyToken, updateDesigns);

// Upload (optional; if you’re also using client->Cloudinary signed uploads, you can keep both)
router.post("/upload", upload.single("file"), uploadImage);

export default router;
