<!-- app.vue -->
<template>
  <div>
    <Head>
      <!-- Apple Splash için örnek çözünürlük -->
      <link
        rel="apple-touch-startup-image"
        href="/apple-splash-1242-2688.jpg"
        media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)"
      />
      <!-- Gerekirse diğer çözünürlükleri de eklersin -->
    </Head>

    <ThemeToggle />
    <NuxtPage />
  </div>
</template>
