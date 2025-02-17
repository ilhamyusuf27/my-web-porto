// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import icon from "astro-icon";
import image from "@astrojs/image";

// https://astro.build/config
export default defineConfig({
  image: {
    service: {
             entrypoint: 'astro/assets/services/sharp',
             config: {
                 limitInputPixels: false,
                 // Optimize common image formats
                 quality: 80,
                 formats: ['webp', 'avif'],
              },
            },
  },
  integrations: [icon(), image()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@assets": path.resolve('./src/assets'),
      }
    },
    build: {
      cssCodeSplit: false,
      rollupOptions: {
        output: {
          manualChunks: {
            // Group vendor dependencies into a single chunk
            vendor: ['react', 'react-dom'],
          },
        },
      },
    },
    // Add cache for dev server
    server: {
      watch: {
        usePolling: false,
      },
    },
  },
  experimental: {
    clientPrerender: true,
  },
});