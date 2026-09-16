import { createDefaultEsmPreset } from "ts-jest";

// Transform TypeScript using native ESM rules from this project.
const tsJestTransformCfg = createDefaultEsmPreset({
  tsconfig: "tsconfig.json",
}).transform;

/** @type {import("jest").Config} */
export default {
  // Run API tests in Node rather than a browser environment.
  testEnvironment: "node",
  // Use ts-jest to compile .ts test and source files during the run.
  transform: {
    ...tsJestTransformCfg,
  },
  // Map TypeScript's NodeNext .js import specifiers to source .ts files.
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  // Load the ignored local environment file before importing the app.
  setupFiles: ["dotenv/config"],
};
