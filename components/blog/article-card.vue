<template>
  <article class="card">
    <h2 class="text-2xl mb-6 flex flex-row flex-wrap gap-1 items-center">
      <span
        v-if="lang"
        class="mt-2 bg-gray-light dark:bg-gray-darker rounded p-1 text-sm title font-thin leading-tight flex-grow-0 flex-shrink basis-0 self-start"
        :title="language"
        :aria-label="language"
        >{{ langClean }}</span
      >
      <nuxt-link
        :to="url"
        class="ml-3 no-underline disable-underline transition:color leading-normal flex-grow flex-shrink-0 basis-0 self-start"
        >{{ title }}</nuxt-link
      >
    </h2>
    <p class="text-gray-darker dark:text-gray-lightest overflow-hidden leading-loose pl-11" v-html="extract"></p>
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
