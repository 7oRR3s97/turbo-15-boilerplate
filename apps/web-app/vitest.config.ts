import path from "path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export const config = defineConfig({
  plugins: [react()],
  test: {
    coverage: {
      reporter: ["lcov"],
    },
    environment: "jsdom",
  },
  resolve: {
    alias: {
      "~": `${path.resolve("./")}/src`,
      "@packages": `${path.resolve("./")}/../../packages`,
      "@apps": `${path.resolve("./")}/../../apps`,
      "@tooling": `${path.resolve("./")}/../../tooling`,
    },
  },
});

export default config;
