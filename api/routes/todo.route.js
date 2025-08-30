import express from "express";
import {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
  getTodosByProject,
  addSubtask,
  toggleSubtask,
  reorderTodos,
  getTodosByDate,
  getNext7DaysTodos,
  duplicateTodo,
  getTodosByFilter,
  getMarkedTodos,
  getTodosByDateRange,
  getMyTodos,
  addSubtodo,
  getTodosToday,
  getTodosThisWeek,
  filterTodos,
  editSubtodo,
  deleteSubtodo,
  getTodosByDayDate,
} from "../controllers/todo.controller.js";
 import { verifyToken } from "../middleware/jwt.js";

import Project from "../models/project.model.js";
import Todo from "../models/todo.model.js";
import projectModel from "../models/project.model.js";
import todoModel from "../models/todo.model.js";

const router = express.Router();

router.post("/", verifyToken, createTodo);
router.get("/", verifyToken, getTodos); // supports ?projectId=xyz
// On server (Express example)
router.get("/tags-only", verifyToken, async (req, res) => {
  try {
    const todos = await Todo.find({}, "tags").lean();
    const allTags = todos.flatMap(todo => todo.tags || []);
    // Case-insensitive unique tags, keep original casing of first occurrence
    const uniqueTagsMap = new Map();
    allTags.forEach(tag => {
      const lowerTag = tag.toLowerCase();
      if (!uniqueTagsMap.has(lowerTag)) {
        uniqueTagsMap.set(lowerTag, tag);
      }
    });
    const uniqueTags = Array.from(uniqueTagsMap.values());
    res.json(uniqueTags);
  } catch (err) {
    console.error("Failed to fetch unique tags", err);
    res.status(500).json({ error: "Failed to fetch tags" });
  }
});
router.get('/marked', verifyToken, getMarkedTodos);
router.get('/filter', verifyToken, getTodosByFilter);
router.get("/next-7-days", verifyToken, getNext7DaysTodos);      // 🆕 Get todos grouped by next 7 days
router.get("/my-todos", verifyToken, getMyTodos);
router.post("/:todoId/subtodos", verifyToken, addSubtodo);
router.get("/today", verifyToken, getTodosToday);
router.get("/this-week", verifyToken, getTodosThisWeek);
router.get("/", verifyToken, filterTodos);
router.get("/dashboard-stats", verifyToken, async (req, res) => {
  const userId = req.userId;
  const totalProjects = await projectModel.countDocuments({ userId });
  const totalTodos = await todoModel.countDocuments({ userId });
  const completedTodos = await todoModel.countDocuments({ userId, status: "done" });
  res.json({ totalProjects, totalTodos, completedTodos });
});

// :variable
// GET /api/todos/date-range?start=2025-07-23&end=2025-07-30
router.get('/date-range', verifyToken, getTodosByDateRange);
router.get("/by-date/:date", verifyToken, getTodosByDate);       // 🆕 Get todos for a specific date

// router.post('/duplicate/:id', duplicateTodo);
router.put("/:id", verifyToken, updateTodo);
router.delete("/:id", verifyToken, deleteTodo);
  router.put("/subtask/:todoId", verifyToken, addSubtask);
router.put("/subtask/toggle/:todoId/:subtaskIndex", verifyToken, toggleSubtask);
router.put("/reorder/:projectId", verifyToken, reorderTodos);
router.get("/project/:projectId", verifyToken, getTodosByProject);
router.post("/:id/duplicate", verifyToken, duplicateTodo);       //  Duplicate a todo
// router.put("/:todoId/subtodos", verifyToken, addSubtodo);
router.put("/:todoId/subtodos/:subtodoId", verifyToken, editSubtodo);
router.delete("/:todoId/subtodos/:subtodoId", verifyToken, deleteSubtodo);
router.get("/date/:date", verifyToken, getTodosByDayDate);

export default router;
