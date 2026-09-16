// Import Zod to define and run request validation rules.
import { z } from "zod";

// Describe the allowed body for POST /api/tasks.
export const createTaskSchema = z.object({
  // Require a non-empty task title.
  title: z.string().min(1, "Title is required"),
  // Allow an optional description, but require it to be a string when present.
  description: z.string().optional(),
});
