<template>
  <select v-model="model" class="filter-select">
    <option value="">{{ placeholder }}</option>
    <option v-for="option in options" :key="option" :value="option">
      {{ option }}
    </option>
  </select>
</template>

<script setup>
defineProps({
  modelValue: String,
  options: Array,
  placeholder: String,
});

const emit = defineEmits(["update:modelValue"]);

// v-model otomatik eşleşmesi için computed kullanıyoruz
const model = defineModel(); // Nuxt 3+ veya Vue 3.3+ için
</script>

<style scoped>
.filter-select {
  width: 100%;
  padding: 4px 8px;
  font-size: 14px;
  border-radius: 6px;
  border: 1px solid #ccc;
}
</style>
