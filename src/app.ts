// Import Express so we can create and configure the API application.
import express from "express";
// Add secure HTTP headers to responses.
import helmet from "helmet";
// Restrict browser requests to the configured frontend origin.
import cors from "cors";
// Limit repeated requests from one IP address.
import rateLimit from "express-rate-limit";
// Import middleware that logs every incoming request.
import { logger } from "./middleware/logger.middleware.js";
// Import the final middleware that formats application errors.
import { errorHandler } from "./middleware/error.middleware.js";
// Import the public registration and login router.
import authRoutes from "./routes/auth.routes.js";
// Import the router containing all task endpoints.
import taskRoutes from "./routes/task.routes.js";

// Create the Express application without starting a network listener yet.
const app = express();

// Set common security headers before handling requests.
app.use(helmet());
// Allow only the configured frontend to call this API from a browser.
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN ?? "http://localhost:3000",
  }),
);
// Apply a broad request limit before public and protected routes.
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
      success: false,
      message: "Too many requests, try again later.",
    },
  }),
);
// Parse JSON request bodies and place the result in req.body.
app.use(express.json());
// Run the logger before every route below this line.
app.use(logger);

// Health-check endpoint to confirm that the API is running.
app.get("/", (req, res) => {
  // Send a JSON response with HTTP status 200 by default.
  res.json({ message: "Task API is running" });
});

// Mount public authentication routes used to register and receive a token.
app.use("/api/auth", authRoutes);

// Mount taskRoutes so its paths start with /api/tasks.
app.use("/api/tasks", taskRoutes);

// Register error handling last so it can catch errors from all routes above.
app.use(errorHandler);

// Export the configured app so server.ts and tests can use it.
export default app;
