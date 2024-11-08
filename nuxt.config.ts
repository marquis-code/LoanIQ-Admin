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
});
