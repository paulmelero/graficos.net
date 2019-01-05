<template>
  <section>
    <the-title>
      <h1 slot="title" class="text-3xl">{{ title }}</h1>
    </the-title>
    <p id="success" class="text-teal-dark font-bold hidden">🙏 Thanks for sending! I'll get in touch ASAP!</p>
    <form
      name="contact"
      method="POST"
      action="#success"
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
          <button type="submit" class="
            rounded
            px-8 py-3
            mt-2
            hover:bg-teal-light
            hover:text-purple-darker
            transition
          ">Send</button>
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
      title
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
