import express from "express";
import { z } from "zod";
import Task from "./task.model.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// Validation schemas
const createTaskSchema = z.object({
  title: z.string().min(1, "Task title is required").max(200, "Title too long")
});

const updateTaskSchema = z.object({
  title: z.string().min(1, "Task title is required").max(200, "Title too long").optional(),
  completed: z.boolean().optional()
}).refine(data => data.title || data.completed !== undefined, {
  message: "At least one field (title or completed) must be provided"
});

router.post("/", protect, async (req, res, next) => {
  try {
    const validatedData = createTaskSchema.parse(req.body);
    const task = await Task.create({
      title: validatedData.title,
      userId: req.user.id
    });
    res.status(201).json(task);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: err.errors[0].message });
    }
    next(err);
  }
});

router.get("/", protect, async (req, res, next) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", protect, async (req, res, next) => {
  try {
    const validatedData = updateTaskSchema.parse(req.body);
    
    // Check if task exists and belongs to user
    const existingTask = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      validatedData,
      { new: true }
    );
    res.json(task);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: err.errors[0].message });
    }
    next(err);
  }
});

router.delete("/:id", protect, async (req, res, next) => {
  try {
    // Check if task exists and belongs to user
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    next(err);
  }
});

export default router;
