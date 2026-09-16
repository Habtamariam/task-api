// Import Express's Router for public authentication endpoints.
import { Router } from "express";
// Import controllers that handle registration and login responses.
import { login, register } from "../controllers/auth.controller.js";
// Import the shared email and password validation middleware.
import { validateBody } from "../middleware/validate.middleware.js";
// Import the schema used by both authentication requests.
import { authSchema } from "../validators/auth.validator.js";

// Create a router that will be mounted under /api/auth.
const router = Router();

// Registration and login are public because they are how users get access.
router.post("/register", validateBody(authSchema), register);
router.post("/login", validateBody(authSchema), login);

// Export the router so app.ts can mount it.
export default router;
