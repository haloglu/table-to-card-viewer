<template>
  <div class="search-box">
    <font-awesome-icon :icon="['fas', 'search']" class="search-icon" />
    <input
      v-model="searchTerm"
      type="text"
      placeholder="Ara..."
      class="search-input"
    />
    <font-awesome-icon
      v-if="searchTerm"
      :icon="['fas', 'xmark']"
      class="clear-icon"
      @click="clearSearch"
    />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});
const emit = defineEmits(["update:modelValue"]);

const searchTerm = ref(props.modelValue);

// Parent'ten gelen modelValue değişirse searchTerm güncellensin
watch(
  () => props.modelValue,
  (val) => {
    searchTerm.value = val;
  }
);

// searchTerm değişirse parent'a bildirelim
watch(searchTerm, (val) => {
  emit("update:modelValue", val);
});

function clearSearch() {
  searchTerm.value = "";
  emit("update:modelValue", "");
}
</script>

<style scoped>
.search-box {
  flex: 1;
  min-width: 0;
  position: relative;
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 16px;
  pointer-events: none;
}

.clear-icon {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 16px;
  cursor: pointer;
  transition: color 0.2s;
}

.clear-icon:hover {
  color: #f87171;
}

.search-input {
  width: 100%;
  padding: 10px 36px 10px 36px;
  font-size: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  color: #374151;
  text-align: left;
  transition: all 0.2s ease;
}

/* Dark Mode */
body.dark .search-input {
  background-color: #2c2c2c;
  color: #f3f3f3;
  border-color: #444;
}

body.dark .search-icon,
body.dark .clear-icon {
  color: #aaa;
}
</style>
