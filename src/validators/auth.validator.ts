// Import Zod to define the shape of authentication request bodies.
import { z } from "zod";

// Require a valid email and a password for registration and login.
export const authSchema = z.object({
  // Validate and normalize the email before it reaches the service.
  email: z.string().email("A valid email is required").toLowerCase(),
  // Require a non-empty password; stronger policy can be added later.
  password: z.string().min(1, "Password is required"),
});
