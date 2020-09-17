<template>
  <div class="flex flex-col content-around min-h-screen bg-container relative">
    <resize-observer />
    <header role="banner" class="relative z-1">
      <the-header></the-header>
    </header>
    <main class="container mx-auto p-4 flex-grow" role="main">
      <nuxt />
      <div class="bg-container" aria-hidden="true"></div>
    </main>
    <footer role="contentinfo">
      <the-footer></the-footer>
    </footer>
  </div>
</template>

<script>
const ResizeObserver = () => import('~/components/renderless/ResizeObserver')
const TheHeader = () => import('~/components/main-presentation/head-nav')
const TheFooter = () => import('~/components/main-presentation/the-footer')

export default {
  components: {
    ResizeObserver,
    TheHeader,
    TheFooter,
  },
}
</script>

<style lang="postcss">
.bg-container {
  &:after {
    content: '';
    @apply absolute inset-0 w-full h-full;
    background-image: url('~assets/images/valves/v2.svg');
    background-size: 100vw;
    background-repeat: no-repeat;
    pointer-events: none;
    background-position: 80vw -30vw;
  }
}
@screen md {
  .bg-container:after {
    background-position: 85vw -9vw;
    background-size: 40vw;
  }
}
</style>
