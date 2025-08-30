import { Router } from 'express';

import { listTemplates, seedTemplates } from '../controllers/template.controller.js';
 import { verifyToken } from "../middleware/jwt.js";

const router = Router();


router.get('/', verifyToken, listTemplates);
router.post('/seed', verifyToken, seedTemplates);

export default router;
