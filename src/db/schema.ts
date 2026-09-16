// Import PostgreSQL table and column builders from Drizzle.
import {
  boolean,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

// Store account credentials separately from task data.
export const users = pgTable("users", {
  // Auto-incrementing unique identifier for each user.
  id: serial("id").primaryKey(),

  // Email is required and unique so one account cannot register twice.
  email: varchar("email", { length: 255 }).notNull().unique(),

  // Store only the Argon2id hash, never the user's plain-text password.
  password: varchar("password", { length: 255 }).notNull(),

  // Record when the account was created.
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Describe the tasks table that Drizzle will later turn into SQL migrations.
export const tasks = pgTable("tasks", {
  // Auto-incrementing integer and unique primary key for each task row.
  id: serial("id").primaryKey(),

  // Required owner; every task belongs to the user who created it.
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),

  // Required text title; PostgreSQL rejects inserts without this value.
  title: varchar("title", { length: 255 }).notNull(),

  // Optional text description; NULL is allowed when no description is supplied.
  description: varchar("description", { length: 1000 }),

  // Completion flag; PostgreSQL uses false when no value is supplied.
  completed: boolean("completed").default(false).notNull(),

  // PostgreSQL sets the creation time automatically for new rows.
  createdAt: timestamp("created_at").defaultNow().notNull(),

  // PostgreSQL sets an initial update time automatically for new rows.
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
