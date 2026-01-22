import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    VitePWA({
      workbox: {
        maximumFileSizeToCacheInBytes: 6650000, // Set to 4MB or any higher value
      },
      manifest: {
        name: "Roadmap.cash",
        short_name: "Roadmap.cash",
        start_url: "./",
        display: "standalone",
        theme_color: "#060f1c",
        background_color: "#060f1c",
        description: "PWA install handler package for Roadmap.cash",
        icons: [
          {
            src: "https://res.cloudinary.com/dtkeyccga/image/upload/v1769067187/logos_512_x_512_px_5_ylmw3u.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "https://res.cloudinary.com/dtkeyccga/image/upload/v1769067187/logos_512_x_512_px_5_ylmw3u.png",
            sizes: "256x256",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "https://res.cloudinary.com/dtkeyccga/image/upload/v1769067187/logos_512_x_512_px_5_ylmw3u.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
        ],
      },
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
    }),
  ],
  define: {
    global: "globalThis",
  },
  resolve: {
    alias: {
      buffer: "buffer",
    },
  },
  optimizeDeps: {
    include: ["buffer"],
  },
});
