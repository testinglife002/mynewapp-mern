import express from 'express';
import { createLabel, getAllLabels } from '../controllers/label.controller.js';

const router = express.Router();

router.post('/', createLabel);
router.get('/', getAllLabels);

export default router;
