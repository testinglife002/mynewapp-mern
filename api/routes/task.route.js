import express from "express";
import {
  addSubtask,
  createSubTask,
  createTask,
  dashboardStatistics,
  deleteRestoreTask,
  duplicateTask,
  getTask,
  getTasks,
  postTaskActivity,
  trashTask,
  updateTask,
} from "../controllers/task.controller.js";

// import { isAdminRoute, protectRoute } from "../middlewares/authMiddlewave.js";
 import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/create", verifyToken, createTask);
router.get("/", verifyToken, getTasks);


router.get("/:id", verifyToken, getTask);
// New route for adding subtask
router.post("/:taskId/subtasks", verifyToken, addSubtask);


router.post("/activity/:id", verifyToken, postTaskActivity);
router.put("/update/:id", verifyToken, updateTask);
router.delete("/delete/:id", verifyToken, deleteRestoreTask);

router.post("/duplicate/:id", verifyToken, duplicateTask);
router.post("/activity/:id", verifyToken, postTaskActivity);

/*
    router.post("/duplicate/:id", protectRoute, isAdminRoute, duplicateTask);
    router.post("/activity/:id", protectRoute, postTaskActivity);

    router.get("/dashboard", protectRoute, dashboardStatistics);
    router.get("/", protectRoute, getTasks);
    router.get("/:id", protectRoute, getTask);

    router.put("/create-subtask/:id", protectRoute, isAdminRoute, createSubTask);
    router.put("/update/:id", protectRoute, isAdminRoute, updateTask);
    router.put("/:id", protectRoute, isAdminRoute, trashTask);

    router.delete(
    "/delete-restore/:id?",
    protectRoute,
    isAdminRoute,
    deleteRestoreTask
    );
*/

export default router;
