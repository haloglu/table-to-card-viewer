<template>
  <div class="splash-wrapper">
    <img src="/app-icon.png" alt="Splash Logo" class="logo" />
  </div>
</template>

<style scoped>
.splash-wrapper {
  height: 100vh;
  width: 100vw;
  background: #2563eb;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo {
  width: 100px;
  height: 100px;
  animation: pulse 1.6s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
}
</style>
