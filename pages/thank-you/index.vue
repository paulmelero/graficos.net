<template>
  <section>
    <div class="flex flex-col items-center py-4">
      <img
        src="images/paper-plane.svg"
        class="block w-24 mb-8"
        alt="Image of a paper plane flying."
      >
      <h4 class="text-4xl mb-3 text-secondary">Message sent 👌</h4>
      <h5 class="text-xl mb-5">I'll be in touch ASAP!</h5>
      <button class="button" @click="goToHome">Go To Home</button>
    </div>
  </section>
</template>

<script>
export default {
  name: 'thankyou',
  head: {
    meta: [
      { hid: 'robots', name: 'robots', content: 'noindex' },
    ]
  },
  data() {
    return {
      sent: false,
    }
  },
  methods: {
    onSubmit() {
      this.sent = true
    },
    goToHome() {
      this.$router.push('/')
    }
  },
}
</script>
