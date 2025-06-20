<template>
  <div>
    <ThemeToggle />
    <SplashScreen v-if="loading" />
    <NuxtPage v-else />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import SplashScreen from "@/components/SplashScreen.vue";

const loading = ref(true);

onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 2000);
});
</script>
