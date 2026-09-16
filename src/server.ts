// Load environment variables from the .env file, if one exists.
import "dotenv/config";
// Import the configured Express app without starting it here.
import app from "./app.js";

// Use PORT from the environment, or 3100 during local development.
const PORT = process.env.PORT || 3100;

// Start accepting HTTP requests on the selected port.
app.listen(PORT, () => {
  // Confirm the server is ready in the terminal.
  console.log(`Server running on port ${PORT}`);
});
