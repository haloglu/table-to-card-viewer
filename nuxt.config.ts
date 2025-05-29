// nuxt.config.ts

// @ts-ignore: PWA config is injected via @vite-pwa/nuxt
export default defineNuxtConfig({
  css: [
    "@fortawesome/fontawesome-svg-core/styles.css",
    "@/assets/scss/main.scss",
    "@/assets/scss/global.scss",
  ],

  build: {
    transpile: ["@fortawesome/vue-fontawesome"],
  },

  modules: ["@vite-pwa/nuxt"],

  app: {
    head: {
      link: [
        { rel: "manifest", href: "/manifest.webmanifest" },
        { rel: "icon", href: "/favicon.ico" },
      ],
    },
  },

  // @ts-ignore: This config is recognized at runtime by the PWA module
  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "Table to Card Viewer",
      short_name: "T2C Viewer",
      description:
        "Toggle between table and card views seamlessly. Responsive, fast, and clean.",
      theme_color: "#2563eb",
      background_color: "#2563eb",
      start_url: "/",
      scope: "/",
      display: "standalone",
      display_override: ["fullscreen", "standalone", "minimal-ui"],
      lang: "tr",
      dir: "ltr",
      icons: [
        {
          src: "/app-icon.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
    devOptions: {
      enabled: true,
    },
  },
});
