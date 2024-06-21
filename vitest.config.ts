/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    include: ["**/__test__/**/*.spec.ts"],
    reporters: ["junit", "json", "default"],
    outputFile: {
      junit: "test-results/junit.xml",
      json: "test-results/results.json",
    }
  },
})