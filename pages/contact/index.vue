<template>
  <section>
    <the-title>
      <h1 slot="title" class="text-3xl">{{ title }}</h1>
    </the-title>
    <form
      name="contact"
      method="POST"
      action="/thank-you"
      data-netlify="true"
      netlify-honeypot="bot-field"
    >
      <p class="hidden" aria-hidden="true">
        <label>Don’t fill this out if you're human: <input name="bot-field" type="text" /></label>
      </p>
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
          rows="4"
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
        <button
          type="submit" class="button"
          @click="onSubmit"
        >Send</button>
      </div>
    </form>
  </section>
</template>

<script>
const TheTitle = () => import('~/components/base-texts/the-title')

const title = 'Contact'

export default {
  name: title,
  transition: 'page-opacity',
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
    onSubmit() {
      this.sent = true
    },
  },
  components: {
    TheTitle,
  }
}
</script>
