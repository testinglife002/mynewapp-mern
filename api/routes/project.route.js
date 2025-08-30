import express from "express";
import {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  shareProject,
  getProjectsByOption,
  getMyProjects,
} from "../controllers/project.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/", verifyToken, createProject);
router.get("/", verifyToken, getProjects); // supports ?optionId=xxx

router.get("/my-projects", verifyToken, getMyProjects);
router.get("/:optionId", verifyToken, getProjectsByOption);

router.put("/:id", verifyToken, updateProject);
router.delete("/:id", verifyToken, deleteProject);
router.put("/share/:projectId", verifyToken, shareProject);

export default router;
