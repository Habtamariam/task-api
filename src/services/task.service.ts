// Import Drizzle helpers for filters, case-insensitive search, and counting.
import { and, count, eq, ilike } from "drizzle-orm";
// Import the database client used to execute queries.
import { db } from "../db/client.js";
// Import the table definition used by the task queries.
import { tasks } from "../db/schema.js";

// Insert a new task and return the generated database row.
export const createTaskService = async (
  userId: number,
  data: Omit<typeof tasks.$inferInsert, "userId">,
) => {
  // returning() includes generated values such as the new ID and timestamps.
  const [task] = await db
    .insert(tasks)
    .values({ ...data, userId })
    .returning();
  return task;
};

// Describe the optional query-string filters accepted by the list endpoint.
export type TaskListQuery = {
  page?: string;
  limit?: string;
  completed?: string;
  search?: string;
};

// Return the authenticated user's tasks with optional filters and pagination.
export const getTasksService = async (userId: number, query: TaskListQuery) => {
  // Parse query strings and use safe defaults for missing or invalid values.
  const pageValue = Number(query.page);
  const limitValue = Number(query.limit);
  const page = Number.isInteger(pageValue) && pageValue > 0 ? pageValue : 1;
  const limit =
    Number.isInteger(limitValue) && limitValue > 0 ? limitValue : 10;

  // Always scope results to the authenticated user first.
  const conditions = [eq(tasks.userId, userId)];

  // Add completion filtering only when the client supplied the parameter.
  if (query.completed !== undefined) {
    conditions.push(eq(tasks.completed, query.completed === "true"));
  }

  // Search titles without case sensitivity when a search term is supplied.
  if (query.search) {
    conditions.push(ilike(tasks.title, `%${query.search}%`));
  }

  // Reuse exactly the same filters for both data and total-count queries.
  const where = and(...conditions);

  // Fetch only the requested page of matching tasks.
  const data = await db
    .select()
    .from(tasks)
    .where(where)
    .limit(limit)
    .offset((page - 1) * limit);

  // Count all matching rows so the client can render pagination controls.
  const [{ value: total }] = await db
    .select({ value: count() })
    .from(tasks)
    .where(where);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

// Find one task only when it belongs to the authenticated user.
export const getTaskService = async (userId: number, id: number) => {
  const [task] = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.id, id), eq(tasks.userId, userId)));

  return task;
};

// Update supplied fields and return the updated database row.
export const updateTaskService = async (
  userId: number,
  id: number,
  data: Omit<typeof tasks.$inferInsert, "userId">,
) => {
  // Refresh updatedAt whenever a task is changed.
  const [task] = await db
    .update(tasks)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
    .returning();

  return task;
};

// Delete a task and return its ID when a row was removed.
export const deleteTaskService = async (userId: number, id: number) => {
  const [deleted] = await db
    .delete(tasks)
    .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
    .returning({ id: tasks.id });

  return deleted;
};
