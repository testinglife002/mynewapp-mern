import express from "express";
import { deleteUser, getAllUsers, getUser, getUserListButMe } from "../controllers/user.controller.js";
 import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

// ✅ Specific route first
router.get("/user-list", verifyToken, getUserListButMe);

 router.get("/allusers", verifyToken, getAllUsers);
// router.get("/", verifyToken, getAllUsers);


router.delete("/:id", verifyToken, deleteUser);

router.get("/:id", verifyToken, getUser);

// router.get("/user-list", verifyToken, getUserListButMe);


export default router;
    
