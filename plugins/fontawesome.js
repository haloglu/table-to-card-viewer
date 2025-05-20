import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faEnvelope,
  faLocationDot,
  faCalendar,
  faShield,
  faSun, // ☀️ EKLENDİ
  faMoon, // 🌙 EKLENDİ
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// 💡 Buraya ekle
library.add(
  faEnvelope,
  faLocationDot,
  faCalendar,
  faShield,
  faSun, // ☀️ EKLENDİ
  faMoon // 🌙 EKLENDİ
);

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("font-awesome-icon", FontAwesomeIcon);
});
