// Import Express types for asynchronous request handlers.
import type { NextFunction, Response } from "express";
// Import the request type populated by requireAuth.
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
// Import the custom error used for expected client-facing failures.
import { AppError } from "../errors/AppError.js";

// Import database operations from the service layer.
import {
  createTaskService,
  deleteTaskService,
  getTaskService,
  getTasksService,
  updateTaskService,
} from "../services/task.service.js";
import type { TaskListQuery } from "../services/task.service.js";

// Ask the service for every task and send the result as JSON.
export const getTasks = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const taskList = await getTasksService(
      req.user!.id,
      req.query as TaskListQuery,
    );
    res.json(taskList);
  } catch (err) {
    // Send unexpected database errors to the centralized error handler.
    next(err);
  }
};

// Ask the service for one task and handle the HTTP response.
export const getTask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    // URL parameters are strings, so convert the ID before calling the service.
    const task = await getTaskService(req.user!.id, Number(req.params.id));

    // Controllers decide which HTTP response represents a missing resource.
    if (!task) {
      return next(new AppError("Task not found", 404));
    }

    res.json(task);
  } catch (err) {
    next(err);
  }
};

// Pass validated request data to the service and return HTTP 201 Created.
export const createTask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const task = await createTaskService(req.user!.id, req.body);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

// Ask the service to update a task and return the updated row.
export const updateTask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const task = await updateTaskService(
      req.user!.id,
      Number(req.params.id),
      req.body,
    );

    if (!task) {
      return next(new AppError("Task not found", 404));
    }

    res.json(task);
  } catch (err) {
    next(err);
  }
};

// Ask the service to delete a task and return HTTP 204 on success.
export const deleteTask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const deleted = await deleteTaskService(
      req.user!.id,
      Number(req.params.id),
    );

    if (!deleted) {
      return next(new AppError("Task not found", 404));
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
