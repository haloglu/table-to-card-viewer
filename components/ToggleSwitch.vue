<template>
  <label class="switch">
    <input
      type="checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
    <span class="slider" />
  </label>
</template>

<script setup>
defineProps(["modelValue"]);
defineEmits(["update:modelValue"]);
</script>

<style scoped lang="scss">
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 32px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  inset: 0;
  background-color: #d1d5db;
  border-radius: 9999px;
  transition: background-color 0.3s ease;
  cursor: pointer;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.slider::before {
  content: "";
  position: absolute;
  height: 26px;
  width: 26px;
  top: 3px;
  left: 4px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

input:checked + .slider {
  background-color: #2563eb;
}

input:checked + .slider::before {
  transform: translateX(26px);
}

/* 🌙 Dark Mode */
body.dark .slider {
  background-color: #4b5563; // Tailwind slate-600
}

body.dark input:checked + .slider {
  background-color: #3b82f6; // Tailwind blue-500
}

body.dark .slider::before {
  background-color: #e5e7eb; // light gray thumb in dark
  box-shadow: 0 2px 6px rgba(255, 255, 255, 0.15);
}
</style>
