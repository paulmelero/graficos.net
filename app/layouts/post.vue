<template>
  <div class="flex flex-col content-around min-h-screen">
    <header role="banner" class="isolate z-1">
      <main-presentation-head-nav />
    </header>
    <main class="flex-grow z-0" role="main">
      <slot />
    </main>
    <footer role="contentinfo" class="min-h-[50vh] grid items-center dark:bg-gray-darkest">
      <the-footer />
    </footer>
  </div>
</template>

<script lang="ts" setup>
const TheFooter = defineAsyncComponent(() => import('~/components/main-presentation/the-footer.vue'))
</script>
