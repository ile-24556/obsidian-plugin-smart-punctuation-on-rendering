// @ts-check

import js from "@eslint/js";
import obsidianmd from "eslint-plugin-obsidianmd";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig(
  globalIgnores([
    "esbuild.config.mjs",
    "eslint.config.mts",
    "jest.config.ts",
    "main.js",
    "version-bump.mjs",
  ]),
  {
    files: ["src/main.ts"],
  },
  js.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
  ...obsidianmd.configs.recommended,
);
