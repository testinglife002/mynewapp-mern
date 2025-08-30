// server/routes/uploadRoutes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';


const router = express.Router();


// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}


// Multer storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
    cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});


const upload = multer({ storage });


// EditorJS image upload endpoint
router.post('/editor-image', upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ success: 0, error: 'No file uploaded' });
        res.json({
        success: 1,
        file: {
        url: `/uploads/${req.file.filename}`
        }
    });
});


// Generic file upload (optional for attachments)
router.post('/file', upload.single('file'), (req, res) => {
        if (!req.file) return res.status(400).json({ success: false, error: 'No file uploaded' });
        res.json({
        success: true,
        url: `/uploads/${req.file.filename}`
    });
});


export default router;