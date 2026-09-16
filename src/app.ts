// Import Express so we can create and configure the API application.
import express from "express";
// Import middleware that logs every incoming request.
import { logger } from "./middleware/logger.middleware.js";
// Import the final middleware that formats application errors.
import { errorHandler } from "./middleware/error.middleware.js";
// Import the router containing all task endpoints.
import taskRoutes from "./routes/task.routes.js";

// Create the Express application without starting a network listener yet.
const app = express();

// Parse JSON request bodies and place the result in req.body.
app.use(express.json());
// Run the logger before every route below this line.
app.use(logger);

// Health-check endpoint to confirm that the API is running.
app.get("/", (req, res) => {
  // Send a JSON response with HTTP status 200 by default.
  res.json({ message: "Task API is running" });
});

// Mount taskRoutes so its paths start with /api/tasks.
app.use("/api/tasks", taskRoutes);

// Register error handling last so it can catch errors from all routes above.
app.use(errorHandler);

// Export the configured app so server.ts and tests can use it.
export default app;
