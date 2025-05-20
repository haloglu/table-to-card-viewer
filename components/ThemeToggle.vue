<template>
  <button @click="toggleMode" class="theme-toggle">
    <font-awesome-icon :icon="mode === 'dark' ? 'sun' : 'moon'" class="icon" />
    {{ mode === "dark" ? "Light Mode" : "Dark Mode" }}
  </button>
</template>

<script setup lang="ts">
import { useColorMode } from "../composables/useColorMode";

const { mode, toggleMode } = useColorMode();
</script>

<style scoped>
.theme-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background-color: #eee;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.theme-toggle .icon {
  width: 16px;
  height: 16px;
}

body.dark .theme-toggle {
  background-color: #333;
  color: #fff;
}
</style>
