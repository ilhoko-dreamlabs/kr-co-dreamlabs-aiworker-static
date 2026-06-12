import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/kr-co-dreamlabs-aiworker-static/",
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: true
  }
});
