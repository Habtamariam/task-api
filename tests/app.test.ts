// Import Supertest for making HTTP requests without opening a real port.
import request from "supertest";
// Import the configured Express app, not server.ts, so Jest controls the process.
import app from "../src/app.js";

describe("API basics", () => {
  // The health route confirms the app can be imported and configured.
  it("reports that the API is running", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Task API is running");
  });

  // Protected routes must reject requests that do not include a JWT.
  it("rejects task requests without a token", async () => {
    const response = await request(app).get("/api/tasks");

    expect(response.status).toBe(401);
  });
});
