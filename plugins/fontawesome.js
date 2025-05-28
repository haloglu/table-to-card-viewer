import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faEnvelope,
  faLocationDot,
  faCalendar,
  faShield,
  faSun,
  faMoon,
  faFilter,
  faSearch,
  faXmark,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// 💡 Buraya ekle
library.add(
  faEnvelope,
  faLocationDot,
  faCalendar,
  faShield,
  faSun,
  faMoon,
  faFilter,
  faSearch,
  faXmark,
  faSpinner
);

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("font-awesome-icon", FontAwesomeIcon);
});
