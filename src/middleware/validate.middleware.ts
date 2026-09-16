// Import Express types for the validation middleware parameters.
import type { NextFunction, Request, Response } from "express";
// Import only Zod's type so the schema can be supplied by any validator.
import type { z } from "zod";

// Return middleware that validates req.body using the supplied Zod schema.
export const validateBody =
  (schema: z.ZodType) => (req: Request, res: Response, next: NextFunction) => {
    // safeParse never throws; it returns either success or validation errors.
    const result = schema.safeParse(req.body);

    // Reject invalid input before the controller receives it.
    if (!result.success) {
      return res.status(422).json({
        success: false,
        // Show the first useful validation message to the client.
        message: result.error.issues[0]?.message ?? "Invalid request body",
      });
    }

    // Replace the body with Zod's validated and cleaned data.
    req.body = result.data;
    // Continue to the controller because validation succeeded.
    next();
  };
