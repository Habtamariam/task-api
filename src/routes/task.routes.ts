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
// Import the schema used when creating a task.
import { createTaskSchema } from "../validators/task.validator.js";

// Create a router whose paths will be mounted under /api/tasks.
const router = Router();

// GET /api/tasks - return all tasks.
router.get("/", getTasks);
// GET /api/tasks/:id - return one task.
router.get("/:id", getTask);
// POST /api/tasks - validate, then create a task.
router.post("/", validateBody(createTaskSchema), createTask);
// PATCH /api/tasks/:id - partially update one task.
router.patch("/:id", updateTask);
// DELETE /api/tasks/:id - delete one task.
router.delete("/:id", deleteTask);

// Export the router so app.ts can mount it.
export default router;
