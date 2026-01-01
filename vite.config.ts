import { defineConfig } from "vite";

export default defineConfig({
  server: {
    open: true,
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        format: "iife",
        entryFileNames: "app.js",
      },
    },
  },
});
