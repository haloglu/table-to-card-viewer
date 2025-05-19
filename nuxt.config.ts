export default defineNuxtConfig({
  css: [
    "@fortawesome/fontawesome-svg-core/styles.css",
    "@/assets/scss/main.scss", // senin kendi scss dosyan da burada zaten
  ],
  build: {
    transpile: ["@fortawesome/vue-fontawesome"],
  },
});
