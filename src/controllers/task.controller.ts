// Import only the Express types needed to type request handlers.
import type { Request, Response } from "express";

// Describe the shape of every task stored by this temporary API.
type Task = {
  // Unique numeric identifier for the task.
  id: number;
  // Required task title.
  title: string;
  // Optional task details, stored as a string.
  description: string;
  // Whether the task has been completed.
  completed: boolean;
};

// Temporary in-memory storage; data is lost when the server restarts.
let tasks: Task[] = [];
// Simple counter used to assign the next task ID.
let nextId = 1;

// Return every task in the in-memory collection.
export const getTasks = (req: Request, res: Response) => {
  res.json(tasks);
};

// Find and return one task using the ID from the URL.
export const getTask = (req: Request, res: Response) => {
  // Route parameters are strings, so convert the ID before comparing it.
  const task = tasks.find((item) => item.id === Number(req.params.id));

  // Stop here with 404 when no task has that ID.
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  // Return the matching task.
  res.json(task);
};

// Create and store a task from the validated request body.
export const createTask = (req: Request, res: Response) => {
  // Build a new task and assign a unique ID.
  const task: Task = {
    id: nextId++,
    title: req.body.title,
    description: req.body.description || "",
    completed: false,
  };

  // Add the new task to memory and return HTTP 201 Created.
  tasks.push(task);
  res.status(201).json(task);
};

// Update selected fields on an existing task.
export const updateTask = (req: Request, res: Response) => {
  // Locate the task identified by the URL parameter.
  const task = tasks.find((item) => item.id === Number(req.params.id));

  // Stop here if the requested task does not exist.
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  // Merge only the fields supplied by the client.
  Object.assign(task, req.body);
  // Return the updated task.
  res.json(task);
};

// Delete an existing task by its URL ID.
export const deleteTask = (req: Request, res: Response) => {
  // Check first so deleting a missing task returns a useful 404 response.
  const taskExists = tasks.some((item) => item.id === Number(req.params.id));

  // Stop here when there is nothing to delete.
  if (!taskExists) {
    return res.status(404).json({ message: "Task not found" });
  }

  // Keep every task except the one being deleted.
  tasks = tasks.filter((item) => item.id !== Number(req.params.id));
  // 204 means success with no response body.
  res.status(204).send();
};
