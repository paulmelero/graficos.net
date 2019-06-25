<template>
  <section>
    <div class="flex flex-col items-center py-4">
      <h1 class="text-4xl mb-3 text-secondary" v-if="error.statusCode === 404">Page not found</h1>
      <h1 class="text-4xl mb-3 text-secondary" v-else>Error found...</h1>
      <button class="button mb-8" @click="goToHome">Go To Home</button>
    </div>
  </section>
</template>

<script>
export default {
  name: 'error',
  props: ['error'],
  transition: 'page-left',
  head: {
    meta: [{ hid: 'robots', name: 'robots', content: 'noindex' }]
  },
  methods: {
    goToHome() {
      this.$router.push('/')
    }
  },
  mounted() {
    // eslint-disable-next-line no-console
    console.log(this.error)
  }
}
</script>
