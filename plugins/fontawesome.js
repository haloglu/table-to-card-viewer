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
  faAngleLeft,
  faAngleRight,
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
  faSpinner,
  faAngleLeft,
  faAngleRight
);

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("font-awesome-icon", FontAwesomeIcon);
});
