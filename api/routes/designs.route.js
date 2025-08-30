import { Router } from 'express';

import { createFromTemplate, getDesign, updateDesign } from '../controllers/designs.controller.js';
 import { verifyToken } from "../middleware/jwt.js";

const router = Router();


router.get('/:id', verifyToken, getDesign);
router.put('/:id', verifyToken, updateDesign);
router.post('/from-template/:projectId', verifyToken, createFromTemplate);

export default router;
