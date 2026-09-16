import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";

// Convert thrown errors into one consistent JSON response format.
export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // These parameters are required for Express to identify error middleware.
  void req;
  void next;

  // Use the custom status for known errors and 500 for unexpected errors.
  const status = err instanceof AppError ? err.status : 500;
  // Expose normal Error messages but hide details for unknown error values.
  const message = err instanceof Error ? err.message : "Internal server error";

  // Send the same shape for validation, not-found, and server errors.
  res.status(status).json({
    success: false,
    message,
  });
};
