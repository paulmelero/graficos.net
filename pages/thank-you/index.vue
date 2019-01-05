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
      <button class="button mb-8" @click="goToHome">Go To Home</button>
      <div aria-hidden="true" class="text-grey text-xs">Image by
        <external-link
          class="text-grey"
          href="https://www.flaticon.com/free-icon/paper-plane_941565"
        >Freepik</external-link>
        (CC 3.0 BY)
      </div>
    </div>
  </section>
</template>

<script>
const ExternalLink = () => import('~/components/main-presentation/base-texts/external-link')

export default {
  name: 'thankyou',
  head: {
    meta: [{ hid: 'robots', name: 'robots', content: 'noindex' }]
  },
  data() {
    return {
      sent: false
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
  components: {
    ExternalLink
  }
}
</script>
