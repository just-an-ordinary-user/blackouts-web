import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import mkcert from "vite-plugin-mkcert";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  const baseUrl = `${env.VITE_BASE_URL ?? "/"}`;

  return {
    plugins: [
      mkcert(),
      react(),
      VitePWA({
        registerType: "autoUpdate",
        manifest: {
          theme_color: "#000000",
          icons: [
            {
              src: `${baseUrl}icon-192x192.png`,
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: `${baseUrl}icon-256x256.png`,
              sizes: "256x256",
              type: "image/png",
            },
            {
              src: `${baseUrl}icon-384x384.png`,
              sizes: "384x384",
              type: "image/png",
            },
            {
              src: `${baseUrl}icon-512x512.png`,
              sizes: "512x512",
              type: "image/png",
            },
          ],
        },
        devOptions: {
          enabled: true,
        },
      }),
    ],
    base: baseUrl,
    server: {
      host: true,
    },
  };
});
