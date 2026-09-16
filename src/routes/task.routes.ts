// Import Express's Router for grouping task endpoints.
import { Router } from "express";
// Import controller functions that perform the task operations.
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
} from "../controllers/task.controller.js";
// Import middleware that validates request bodies.
import { validateBody } from "../middleware/validate.middleware.js";
// Import authentication middleware for protected task endpoints.
import { requireAuth } from "../middleware/auth.middleware.js";
// Import the schema used when creating a task.
import { createTaskSchema } from "../validators/task.validator.js";

// Create a router whose paths will be mounted under /api/tasks.
const router = Router();

// GET /api/tasks - authenticate first, then return all tasks.
router.get("/", requireAuth, getTasks);
// GET /api/tasks/:id - authenticate first, then return one task.
router.get("/:id", requireAuth, getTask);
// POST /api/tasks - authenticate first, then validate, then create a task.
router.post("/", requireAuth, validateBody(createTaskSchema), createTask);
// PATCH /api/tasks/:id - authenticate first, then update one task.
router.patch("/:id", requireAuth, updateTask);
// DELETE /api/tasks/:id - authenticate first, then delete one task.
router.delete("/:id", requireAuth, deleteTask);

// Export the router so app.ts can mount it.
export default router;
