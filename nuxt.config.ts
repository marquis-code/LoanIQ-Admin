import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  postcss: {
    plugins: {
      "postcss-import": {},
      "tailwindcss/nesting": {},
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  plugins: [],
  modules: ["@nuxtjs/tailwindcss"],
  css: ["/assets/css/main.css", "/assets/css/custom.css"],
  tailwindcss: {
    cssPath: "@/assets/css/main.css",
  },
    // Server configuration to set port to 3030
    server: {
      port: 3030,
      host: '0.0.0.0' // This makes the server accessible from all network interfaces
    },
});
