// Import Express types for the authentication middleware parameters.
import type { NextFunction, Request, Response } from "express";
// Import JWT verification for checking signed access tokens.
import jwt, { type JwtPayload } from "jsonwebtoken";
// Import the shared application error type for 401 responses.
import { AppError } from "../errors/AppError.js";

// Describe the identity attached to requests after authentication succeeds.
type AuthenticatedUser = {
  id: number;
};

// Add the authenticated user field locally without changing Express globally.
export type AuthenticatedRequest = Request & {
  user?: AuthenticatedUser;
};

// Require a valid Bearer token before allowing a request to continue.
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Read the Authorization header sent by the client.
  const header = req.headers.authorization;

  // Reject requests that do not provide credentials.
  if (!header) {
    return next(new AppError("No token provided", 401));
  }

  // Expected format: Bearer <token>.
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(new AppError("Invalid authorization format", 401));
  }

  // The server secret is required to verify the token signature.
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    return next(new Error("JWT_SECRET is not configured"));
  }

  try {
    // verify checks the signature and expiration, then decodes the payload.
    const payload = jwt.verify(token, jwtSecret);

    // JWT payloads can be strings, so require an object with a numeric userId.
    if (
      typeof payload === "string" ||
      typeof (payload as JwtPayload & { userId?: unknown }).userId !== "number"
    ) {
      return next(new AppError("Invalid or expired token", 401));
    }

    // Attach the authenticated identity for downstream controllers and services.
    (req as AuthenticatedRequest).user = {
      id: (payload as JwtPayload & { userId: number }).userId,
    };
    next();
  } catch {
    // Expired, forged, or malformed tokens are all unauthenticated requests.
    next(new AppError("Invalid or expired token", 401));
  }
};

export {};
