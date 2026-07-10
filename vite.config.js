import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { generateSitemap } from "./scripts/generate-sitemap.mjs";

function sitemapPlugin() {
  return {
    name: "axiolink-sitemap",
    apply: "build",
    async closeBundle() {
      await generateSitemap({ outDir: "dist" });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), sitemapPlugin()],
  server: {
    port: 3005,
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
  build: {
    target: "es2020",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("three") || id.includes("@react-three")) return "vendor-three";
          if (id.includes("framer-motion")) return "vendor-motion";
          if (
            id.includes("react-dom") ||
            id.includes("react-router") ||
            id.includes("/react/")
          ) {
            return "vendor-react";
          }
          if (id.includes("@tanstack/react-query")) return "vendor-query";
          if (id.includes("recharts")) return "vendor-charts";
        },
      },
    },
  },
});
