import { Router } from 'express';

 import { verifyToken } from "../middleware/jwt.js";
import { createProject, deleteProject, listProjects, renameProject } from '../controllers/ProjectDesign.controller.js';

const router = Router();


router.get('/', verifyToken, listProjects);
router.post('/', verifyToken, createProject);
router.patch('/:id', verifyToken, renameProject);
router.delete('/:id', verifyToken, deleteProject);

export default router;
