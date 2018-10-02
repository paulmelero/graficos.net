<template>
  <div class="flex flex-col content-around h-screen">
    <header role="banner">
      <the-header></the-header>
    </header>
    <main class="container mx-auto p-4 flex-grow" role="main">
      <nuxt/>
    </main>
    <footer role="contentinfo">
      <the-footer></the-footer>
    </footer>
  </div>
</template>

<script>
const TheHeader = () => import('~/components/main-presentation/head-nav.vue')
const TheFooter = () => import('~/components/main-presentation/the-footer.vue')
export default {
  components: {
    TheHeader,
    TheFooter
  }
}
</script>

<style>
body {
  background-color: config('colors.grey-lightest');
  font-family: config('fonts.sans');
}
</style>
