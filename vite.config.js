import { defineConfig } from "vite";
import { resolve } from "path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  publicDir: resolve(__dirname, "public"),
  build: {
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      outDir: resolve(__dirname, "public"),
      injectRegister: "auto",
      srcDir: "public",
      filename: "sw.js",
      manifest: {
        name: "Story App",
        short_name: "StoryApp",
        start_url: ".",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#2196f3",
        icons: [
          {
            src: "icons/icon-128x128.png",
            sizes: "128x128",
            type: "image/png",
          },
          {
            src: "icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        shortcuts: [
          {
            name: "Tambah Story",
            short_name: "Tambah",
            description: "Tambah story baru",
            url: "/add",
            icons: [{ src: "icons/add-shortcut.png", sizes: "192x192" }],
          },
        ],
        screenshots: [
          {
            src: "screenshots/desktop.png",
            sizes: "1366x768",
            type: "image/png",
            label: "Tampilan Desktop",
          },
          {
            src: "screenshots/mobile.png",
            sizes: "375x812",
            type: "image/png",
            label: "Tampilan Mobile",
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/story-api\.dicoding\.dev\/v1\/.*$/,
            handler: "NetworkFirst",
            options: { cacheName: "api-cache" },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
            handler: "CacheFirst",
            options: { cacheName: "image-cache" },
          },
        ],
      },
      devOptions: {
        enabled: false,
        type: "none",
      },
    }),
  ],
});
