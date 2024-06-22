import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import legacy from "@vitejs/plugin-legacy";
import vue2 from "@vitejs/plugin-vue2";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue2(),
    legacy({
      targets: ["ie >= 11"],
      additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    include: ["**/__test__/**/*.spec.ts"],
    reporters: ["junit", "json", "default"],
    outputFile: {
      junit: "test-results/junit.xml",
      json: "test-results/results.json",
    },
    coverage: {
      reporter: ["text","json-summary","json"],
    }
  },
});
