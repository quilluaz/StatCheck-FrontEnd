import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import process from "process";
import { Buffer } from "buffer";
import util from "util";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      process: "process/browser",
      util: "util",
      buffer: "buffer",
      stream: "stream-browserify",
    },
  },
  define: {
    global: "window",
    process: { env: { NODE_ENV: "development" } },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
