<template>
  <section>
    <the-title>
      <h1 slot="title" class="text-3xl">{{ title }}</h1>
    </the-title>
    <transition name="fade">
      <p v-if="sent" class="text-teal-dark font-bold">🙏 Thanks for sending! I'll get in touch ASAP!</p>
    </transition>
    <form
      @submit="onSubmit"
      name="contact"
      method="POST"
      data-netlify="true"
      netlify
    >
        <label>Name
          <input
            type="text"
            name="name"
            autocomplete="name"
            placeholder="Your name..."
            required
            class="
              mb-3 mt-2
              p-2
              rounded
              bg-grey-light
              w-full
            "
          />
        </label>
        <label>Email
          <input
            type="email"
            name="email"
            autocomplete="email"
            placeholder="Your email..."
            required
            class="
              mb-3 mt-2
              p-2
              rounded
              bg-grey-light
              w-full
            "
          />
        </label>
        <label>Message:
          <textarea
            name="message"
            placeholder="Your message..."
            required
            minlength="4"
            class="
              mb-3 mt-2
              p-2
              rounded
              bg-grey-light
              w-full max-w-full
            "
          ></textarea>
        </label>
        <div class="row flex justify-end">
          <transition name="fade">
            <button
              type="button"
              class="button mr-3"
              @click="goToHome"
              v-if="sent"
            >Go To Home</button>
          </transition>
          <button type="submit" class="button"
          >Send</button>
        </div>
    </form>
    <p id="success"></p>
  </section>
</template>

<script>
const TheTitle = () => import('~/components/main-presentation/base-texts/the-title')

const title = 'Contact'

export default {
  name: title,
  head: {
    title,
    meta: [
      { hid: 'description', name: 'description',
        content: 'Contact - Front end developer Paul Melero. Freelancing, consultant.'
      }
    ]
  },
  data() {
    return {
      sent: false,
      title
    }
  },
  methods: {
    onSubmit(e) {
      e.preventDefault()
      this.sent = true
    },
    goToHome() {
      this.$router.push('/')
    }
  },
  components: {
    TheTitle,
  }
}
</script>

<style scoped>
#success:target {
  display: block;
}
</style>
