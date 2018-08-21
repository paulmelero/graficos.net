<template>
  <div>
    <header>
      <the-header></the-header>
    </header>
    <main class="container mx-auto p-4">
      <nuxt/>
    </main>
  </div>
</template>

<script>
const TheHeader = () => import('~/components/main-presentation/head-nav.vue')
export default {
  components: {
    TheHeader
  }
}
</script>

<style>
body {
  background-color: config('colors.grey-lightest');
  font-family: config('fonts.sans');
}
</style>
