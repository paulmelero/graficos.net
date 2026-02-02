<template>
  <div class="flex flex-col content-around min-h-screen relative">
    <header role="banner" class="isolate z-10 sticky top-0">
      <main-presentation-head-nav />
    </header>

    <main
      class="pb-24"
      :class="container === 'contained' ? 'container mx-auto pt-10' : 'w-full' + ' flex-grow'"
      role="main"
    >
      <div class="relative z-[2]"><slot /></div>
      <div class="isolate" v-if="container === 'contained'"><div class="bg-container" aria-hidden="true" /></div>
    </main>

    <main-presentation-the-footer />
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

<style lang="postcss" scoped>
.bg-container {
  &:after {
    content: '';
    @apply absolute z-0 inset-0 w-full h-full;
    background-image: url('~/assets/images/bgs/curves.svg');
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
