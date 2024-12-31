<template>
  <div class="flex flex-col content-around min-h-screen">
    <header role="banner" class="isolate z-1">
      <the-header/>
    </header>
    <main class="flex-grow z-0" role="main">
      <slot />
    </main>
    <footer role="contentinfo">
      <the-footer/>
    </footer>
  </div>
</template>

<script lang="ts" setup>
const TheHeader = defineAsyncComponent(() => import('~/components/main-presentation/head-nav.vue'))
const TheFooter = defineAsyncComponent(() => import('~/components/main-presentation/the-footer.vue'))
</script>
