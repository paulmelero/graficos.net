<template>
  <div class="flex flex-col content-around min-h-screen">
    <header role="banner" class="isolate z-1">
      <the-header></the-header>
    </header>
    <main class="flex-grow z-0" role="main">
      <slot />
    </main>
    <footer role="contentinfo">
      <the-footer></the-footer>
    </footer>
  </div>
</template>

<script setup lang="ts">
const TheHeader = defineAsyncComponent(() => import('~/components/main-presentation/head-nav.vue'))
const TheFooter = defineAsyncComponent(() => import('~/components/main-presentation/the-footer.vue'))
</script>
