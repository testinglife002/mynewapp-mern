import { Router } from 'express';


import {  } from '../controllers/canvaComment.controller.js';
 import { verifyToken } from "../middleware/jwt.js";
import { createComment, listComments, resolveComment } from '../controllers/canvaComment.controller.js';

const router = Router();


router.get('/:designId', verifyToken, listComments);
router.post('/:designId', verifyToken, createComment);
router.patch('/resolve/:id', verifyToken, resolveComment);

export default router;
