import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "fax.svg"],
      manifest: {
        name: "Scrapbox Lifelog",
        short_name: "Scrog",
        description: "Lifelog client for Scrapbox",
        theme_color: "#242424",
        icons: [
          {
            src: "android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        share_target: {
          action: "/",
          method: "GET",
          params: {
            title: "title",
            text: "text",
          },
        },
      },
    }),
  ],
});
