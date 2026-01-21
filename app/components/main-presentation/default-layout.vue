<template>
  <div class="flex flex-col content-around min-h-screen relative">
    <header role="banner" class="isolate z-10">
      <main-presentation-head-nav />
    </header>
    <main :class="container === 'contained' ? 'container mx-auto  py-10' : 'w-full' + ' flex-grow'" role="main">
      <div class="relative z-[2]"><slot /></div>
      <div class="isolate" v-if="container === 'contained'"><div class="bg-container" aria-hidden="true" /></div>
    </main>
    <footer role="contentinfo">
      <main-presentation-the-footer />
    </footer>
  </div>
</template>

<script lang="ts" setup>
const colorMode = useColorMode()

withDefaults(
  defineProps<{
    container?: 'contained' | 'full'
  }>(),
  {
    container: 'contained',
  }
)

useHead({
  htmlAttrs: {
    class: colorMode.preference || 'dark',
  },
})
</script>

<style lang="postcss">
.bg-container {
  &:after {
    content: '';
    @apply absolute z-0 inset-0 w-full h-full;
    background-image: url('~/assets/images/valves/v2.svg');
    background-size: 100vw;
    background-repeat: no-repeat;
    pointer-events: none;
    background-position: 80vw -30vw;
  }
}
.dark .bg-container:after {
  filter: opacity(0.1);
}
@screen md {
  .bg-container:after {
    background-position: 85vw -9vw;
    background-size: 40vw;
  }
}
</style>
