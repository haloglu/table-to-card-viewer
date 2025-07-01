<template>
  <div class="search-box d-none d-lg-flex">
    <font-awesome-icon :icon="['fas', 'search']" class="search-icon" />
    <SearchInput v-model="searchTerm" />
    <font-awesome-icon
      v-if="searchTerm"
      :icon="['fas', 'xmark']"
      class="clear-icon"
      @click="clearSearch"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";
import SearchInput from "./SearchInput.vue";

const props = defineProps({
  modelValue: String,
});
const emit = defineEmits(["update:modelValue"]);

const searchTerm = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

function clearSearch() {
  searchTerm.value = "";
}
</script>

<style scoped>
.search-box {
  flex: 1;
  min-width: 0;
  position: relative;
  display: flex;
  align-items: center;
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
</style>
