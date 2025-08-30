// server/routes/note.routes.js
import { Router } from 'express';
// import { requireUser } from '../middleware/auth.js';
import { copyNote, createNote, deleteNote, getNote, getNoteById, listNotes, shareNote, updateNote } from '../controllers/note.controller.js';
 import { verifyToken } from "../middleware/jwt.js";

const router = Router();


// router.use(requireUser);

router.get('/', verifyToken, listNotes);
router.post('/', verifyToken, createNote);

router.get('/:id', verifyToken, getNote);   // <-- added
router.get("/:id", verifyToken, getNoteById);
router.put('/:id', verifyToken, updateNote);
router.delete('/:id', verifyToken, deleteNote);
router.post('/:id/share', verifyToken, shareNote);
router.post('/:id/copy-to-me', verifyToken, copyNote);


export default router;