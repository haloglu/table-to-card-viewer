<template>
  <div class="search-toggle-wrapper" ref="wrapperRef">
    <button
      class="search-icon-button"
      @click="toggleSearch"
      aria-label="Search toggle"
    >
      <font-awesome-icon :icon="['fas', 'search']" />
    </button>

    <transition name="fade">
      <div v-if="showSearch" class="search-input-container">
        <SearchInput v-model="searchTerm" />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import SearchInput from "./SearchInput.vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});
const emit = defineEmits(["update:modelValue"]);

const searchTerm = ref(props.modelValue);
const showSearch = ref(false);
const wrapperRef = ref(null);

watch(
  () => props.modelValue,
  (newVal) => {
    searchTerm.value = newVal;
  }
);

watch(searchTerm, (newVal) => {
  emit("update:modelValue", newVal);
});

function toggleSearch() {
  showSearch.value = !showSearch.value;
}

// Dışarı tıklama yakalama
function handleClickOutside(event) {
  if (wrapperRef.value && !wrapperRef.value.contains(event.target)) {
    showSearch.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.search-toggle-wrapper {
  position: relative;
  width: 60px; /* page size dropdown genişliği ile eşleşmeli */
}

.search-icon-button {
  width: 100%;
  height: 38px;
  color: #262626;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 8px;
  background-color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.search-icon-button:hover {
  border-color: #2563eb;
  background-color: #f0f9ff;
}

.search-input-container {
  position: absolute;
  min-height: 38px;
  top: 110%;
  left: 0;
  width: 240px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  padding: 8px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  z-index: 100;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
