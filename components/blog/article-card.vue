<template>
  <article class="card">
    <h2 class="text-2xl mb-6">
      <span
        v-if="lang"
        class="bg-grey-light rounded p-1 align-middle inline-block text-sm title font-thin leading-tight"
        :title="language"
        :aria-label="language"
        >{{ langClean }}</span
      >
      <span v-if="!url">{{ title }}</span>
      <nuxt-link v-else :to="url" class="no-underline disable-underline transition:color leading-normal">{{
        title
      }}</nuxt-link>
    </h2>
    <p class="text-grey-darker overflow-hidden leading-loose" v-html="extract"></p>
  </article>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      required: false,
      default: () => '',
    },
    title: {
      type: String,
      required: true,
      default: () => '',
    },
    extract: {
      type: String,
      required: false,
      default: () => '',
    },
    lang: {
      // TODO: https://github.com/nuxt-community/nuxt-i18n
      type: String,
      required: true,
      default: () => 'EN',
    },
  },
  computed: {
    language() {
      return ((this.lang + '').toLowerCase() === 'en' && 'English') || 'Spanish'
    },
    langClean() {
      return (this.language + '').slice(0, 2).toUpperCase()
    },
  },
}
</script>
