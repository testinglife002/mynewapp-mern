// /backend/controllers/design.controller.js
import Design from "../models/design.model.js";
import cloudinary from "cloudinary";


cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// CREATE
export const saveDesign = async (req, res) => {
   // console.log(req.body);
  try {
    const { title, elements, userId, thumbnailUrl } = req.body;
    const doc = await Design.create({ title: title || "Untitled", elements, userId, thumbnailUrl });
    res.status(201).json({ success: true, design: doc });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getDesigns = async (req, res) => {
  try {
    const designs = await Design.find().sort({ createdAt: -1 });
    res.json(designs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// READ ONE
export const getDesign = async (req, res) => {
  try {
    const doc = await Design.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Not found" });
    res.json({ success: true, design: doc });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LIST MINE (filter by userId)
export const listDesigns = async (req, res) => {
  try {
    const userId = req.userId;
    const docs = await Design.find(userId ? { userId } : {}).sort({ updatedAt: -1 }).limit(100);
    res.json({ success: true, designs: docs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE (partial)
export const updateDesign = async (req, res) => {
  try {
    const { title, elements, thumbnailUrl } = req.body;
    const doc = await Design.findByIdAndUpdate(
      req.params.id,
      { ...(title !== undefined && { title }), ...(elements && { elements }), ...(thumbnailUrl && { thumbnailUrl }) },
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: "Not found" });
    res.json({ success: true, design: doc });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DIRECT IMAGE UPLOAD (if you kept this)
export const uploadImage = async (req, res) => {
  try {
    const file = req.file;
    const result = await cloudinary.v2.uploader.upload(file.path, { folder: "designs" });
    res.json({ url: result.secure_url, publicId: result.public_id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get all designs by current user
export const getUserDesigns = async (req, res) => {
  try {
    const userId = req.userId;
    const designs = await Design.find({ userId }).sort({ updatedAt: -1 });
    res.status(200).json(designs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch designs." });
  }
};

// Get single design
export const getDesignById = async (req, res) => {
  try {
    const design = await Design.findById(req.params.designId);
    if (!design) return res.status(404).json({ message: "Design not found." });
    res.status(200).json(design);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch design." });
  }
};

// Update / autosave design
export const updateDesigns = async (req, res) => {
  try {
    const updatedDesign = await Design.findByIdAndUpdate(
      req.params.designId,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedDesign);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update design." });
  }
};

