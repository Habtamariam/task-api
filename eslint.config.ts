// ESLint's recommended JavaScript rules.
import js from "@eslint/js";
// Turns off rules that conflict with Prettier formatting.
import eslintConfigPrettier from "eslint-config-prettier";
// Provides predefined global variables for Node.js.
import globals from "globals";
// Adds recommended TypeScript linting rules.
import tseslint from "typescript-eslint";
// Helper for creating a typed flat ESLint configuration.
import { defineConfig } from "eslint/config";

// Export the rules ESLint uses when checking this project.
export default defineConfig([
  {
    // Apply these rules to JavaScript and TypeScript source files.
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    // Combine JavaScript and TypeScript recommended rules.
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      // Recognize Node.js globals such as process and console.
      globals: globals.node,
    },
  },
  {
    // Do not lint generated output or installed dependencies.
    ignores: ["dist/**", "node_modules/**"],
  },
  // Let Prettier own formatting instead of ESLint.
  eslintConfigPrettier,
]);
