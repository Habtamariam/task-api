// Import Express types for asynchronous request handlers.
import type { NextFunction, Request, Response } from "express";
// Import Drizzle's equality helper for WHERE clauses.
import { eq } from "drizzle-orm";
// Import the database client used to execute queries.
import { db } from "../db/client.js";
// Import the Drizzle table definition used by every query.
import { tasks } from "../db/schema.js";
// Import the custom error used for expected client-facing failures.
import { AppError } from "../errors/AppError.js";

// Read every task from PostgreSQL.
export const getTasks = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // select().from(tasks) becomes SELECT * FROM tasks.
    const taskList = await db.select().from(tasks);
    res.json(taskList);
  } catch (err) {
    // Forward database failures to the centralized error handler.
    next(err);
  }
};

// Read one task by the numeric ID in the URL.
export const getTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // URL parameters are strings, so convert the ID before querying PostgreSQL.
    const [task] = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, Number(req.params.id)));

    // Forward a controlled 404 error when no row matches the ID.
    if (!task) {
      return next(new AppError("Task not found", 404));
    }

    // Return the row found by the database.
    res.json(task);
  } catch (err) {
    // Forward database failures to the centralized error handler.
    next(err);
  }
};

// Insert a validated request body into PostgreSQL.
export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // returning() gives back the inserted row, including its generated ID.
    const [task] = await db.insert(tasks).values(req.body).returning();
    res.status(201).json(task);
  } catch (err) {
    // Forward database failures to the centralized error handler.
    next(err);
  }
};

// Update selected fields on an existing database row.
export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Update only the fields supplied by the client and refresh updatedAt.
    const [task] = await db
      .update(tasks)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(tasks.id, Number(req.params.id)))
      .returning();

    // Forward a controlled 404 error when no row was updated.
    if (!task) {
      return next(new AppError("Task not found", 404));
    }

    // Return the updated database row.
    res.json(task);
  } catch (err) {
    // Forward database failures to the centralized error handler.
    next(err);
  }
};

// Delete an existing database row by its URL ID.
export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // returning() tells us whether a row with this ID existed.
    const deleted = await db
      .delete(tasks)
      .where(eq(tasks.id, Number(req.params.id)))
      .returning({ id: tasks.id });

    // Forward a controlled 404 error when no row was deleted.
    if (deleted.length === 0) {
      return next(new AppError("Task not found", 404));
    }

    // 204 means successful deletion with no response body.
    res.status(204).send();
  } catch (err) {
    // Forward database failures to the centralized error handler.
    next(err);
  }
};
