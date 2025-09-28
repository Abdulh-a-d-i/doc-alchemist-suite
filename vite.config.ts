import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // 👇 This is the important part
  build: {
    rollupOptions: {
      // keep defaults
    },
  },
  preview: {
    port: 4173,
    // 👇 fallback for SPA routing in preview
    strictPort: true,
  },
}));
