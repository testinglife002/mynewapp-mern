import express from "express";
import {
  createOption,
  getOptions,
  updateOption,
  deleteOption,
} from "../controllers/option.controller.js";
 import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/", verifyToken, createOption);
router.get("/", verifyToken, getOptions);
router.put("/:id", verifyToken, updateOption);
router.delete("/:id", verifyToken, deleteOption);

export default router;
