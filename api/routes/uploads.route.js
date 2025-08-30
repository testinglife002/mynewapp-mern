import { Router } from 'express';

import { getSignature } from '../controllers/uploads.controller.js';
 import { verifyToken } from "../middleware/jwt.js";

const router = Router();


router.get('/signature', verifyToken, getSignature);

export default router;
