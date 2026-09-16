// Import Express types for the middleware parameters.
import type { NextFunction, Request, Response } from "express";

// Log each request, then pass control to the next middleware or route.
export const logger = (req: Request, res: Response, next: NextFunction) => {
  // Print the HTTP method and requested URL in the terminal.
  console.log(`${req.method} ${req.originalUrl}`);
  // Required because this middleware does not send a response itself.
  next();
};
