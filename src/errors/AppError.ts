// A controlled application error with an HTTP status for the error handler.
export class AppError extends Error {
  // The HTTP status that should be sent to the client.
  status: number;

  // Create an error with a message and an optional status code.
  constructor(message: string, status = 500) {
    // Initialize the standard Error message.
    super(message);
    // Store the status for centralized response formatting.
    this.status = status;
    // Keep the class name correct when targeting older JavaScript runtimes.
    this.name = "AppError";
  }
}
