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
        { rel: "apple-touch-icon", href: "/app-icon.png" }, // ICON da önemli ✅

        // SPLASH SCREENLER ✅
        {
          rel: "apple-touch-startup-image",
          href: "/apple-splash-640-1136.jpg",
          media:
            "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)",
        },
        {
          rel: "apple-touch-startup-image",
          href: "/apple-splash-750-1334.jpg",
          media:
            "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)",
        },
        {
          rel: "apple-touch-startup-image",
          href: "/apple-splash-828-1792.jpg",
          media:
            "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)",
        },
        {
          rel: "apple-touch-startup-image",
          href: "/apple-splash-1125-2436.jpg",
          media:
            "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)",
        },
        {
          rel: "apple-touch-startup-image",
          href: "/apple-splash-1170-2532.jpg",
          media:
            "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)",
        },
        {
          rel: "apple-touch-startup-image",
          href: "/apple-splash-1284-2778.jpg",
          media:
            "(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)",
        },
        {
          rel: "apple-touch-startup-image",
          href: "/apple-splash-1179-2556.jpg",
          media:
            "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)",
        },
        {
          rel: "apple-touch-startup-image",
          href: "/apple-splash-1290-2796.jpg",
          media:
            "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)",
        },
        {
          rel: "apple-touch-startup-image",
          href: "/apple-splash-1536-2048.jpg",
          media:
            "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)",
        },
        {
          rel: "apple-touch-startup-image",
          href: "/apple-splash-1668-2224.jpg",
          media:
            "(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)",
        },
        {
          rel: "apple-touch-startup-image",
          href: "/apple-splash-1668-2388.jpg",
          media:
            "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)",
        },
        {
          rel: "apple-touch-startup-image",
          href: "/apple-splash-2048-2732.jpg",
          media:
            "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)",
        },
      ],
      meta: [
        { name: "apple-mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      ],
    },
  },

  // @ts-ignore: This config is recognized at runtime by the PWA module
  pwa: {
    registerType: "autoUpdate",

    includeAssets: [
      "favicon.ico",
      "app-icon.png",
      "offline.html",
      "404.html", // ✅ Netlify fallback için (kopyasını almayı unutma)
    ],

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

    // 💥 EKLENDİ: offline.html'i precache listesine almak için
    workbox: {
      globPatterns: ["**/*.{js,css,html,ico,png,svg}"], // ✅ offline.html dahil olur
      navigateFallback: "/offline.html",
      navigateFallbackDenylist: [
        new RegExp("^/offline.html$"),
        new RegExp("\\.\\w+$"),
      ],
      runtimeCaching: [
        {
          urlPattern: ({ request }) => request.mode === "navigate",
          handler: "NetworkFirst",
          options: {
            cacheName: "pages-cache",
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24 * 7,
            },
          },
        },
        {
          urlPattern: /\.(?:js|css|woff2?)$/,
          handler: "CacheFirst",
          options: {
            cacheName: "static-resources",
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24 * 30,
            },
          },
        },
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif|ico)$/,
          handler: "CacheFirst",
          options: {
            cacheName: "image-cache",
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 30,
            },
          },
        },
      ],
    },

    devOptions: {
      enabled: true,
    },
  },
});
