// Import Express types for authentication request handlers.
import type { NextFunction, Request, Response } from "express";
// Import the shared error type for a generic login failure response.
import { AppError } from "../errors/AppError.js";
// Import registration and login business operations.
import { loginUser, registerUser } from "../services/auth.service.js";

// Create an account using the already validated request body.
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // The service hashes the password before storing it.
    const user = await registerUser(req.body.email, req.body.password);
    res.status(201).json(user);
  } catch (err) {
    // Forward database or hashing failures to the central error handler.
    next(err);
  }
};

// Verify credentials and return a JWT for future protected requests.
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // The service returns null for either an unknown email or wrong password.
    const token = await loginUser(req.body.email, req.body.password);

    if (!token) {
      // Keep login failures generic so attackers cannot identify registered emails.
      return next(new AppError("Invalid email or password", 401));
    }

    // Send the signed token to the client; it can use it as a Bearer token.
    res.json({ token });
  } catch (err) {
    next(err);
  }
};
