<template>
  <article class="max-w-lg border rounded overflow-hidden shadow-md hover:shadow-lg p-6 transition:box-shadow">
    <h2 class="text-2xl mb-6">
      <span
        v-if="lang"
        class="bg-grey-light rounded p-1 mr-2 text-sm"
        :title="language"
        :aria-label="language"
      >{{ langClean }}</span>
      <span v-if="!url">{{ title }}</span>
      <nuxt-link
        v-else
        :to="url"
        class="no-underline disable-underline transition:color"
      >{{ title }}</nuxt-link>
    </h2>
    <p class="text-grey-darker overflow-hidden leading-loose">{{ extract }}</p>
  </article>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      required: false,
      default: () => ''
    },
    title: {
      type: String,
      required: true,
      default: () => ''
    },
    extract: {
      type: String,
      required: false,
      default: () => ''
    },
    lang: { // TODO: https://github.com/nuxt-community/nuxt-i18n
      type: String,
      required: true,
      default: () => 'EN'
    },
  },
  computed: {
    language() {
      return (this.lang + '').toLowerCase() === 'en' && 'English' || 'Spanish'
    },
    langClean() {
      return (this.language + '').slice(0, 2).toUpperCase()
    }
  }
}
</script>
