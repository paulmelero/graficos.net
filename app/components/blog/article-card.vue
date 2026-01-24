<template>
  <article class="card">
    <h2 class="text-2xl font-title flex mb-2 flex-row flex-wrap gap-1 items-center">
      <span
        v-if="lang"
        class="font-title mt-2 bg-gray-light dark:bg-gray-darker p-1 text-sm leading-tight flex-grow-0 flex-shrink basis-0 self-start uppercase"
        :title="language"
        :aria-label="language"
        >{{ lang }}</span
      >
      <nuxt-link
        :to="url"
        class="ml-3 no-underline disable-underline transition:color leading-normal flex-grow flex-shrink-0 basis-0 self-start"
        >{{ title }}</nuxt-link
      >
    </h2>
    <base-texts-the-time
      :date="date"
      class="text-gray-darker dark:text-gray-light font-bold leading-tight text-sm pl-12 mb-4 block"
    />
    <!-- eslint-disable-next-line vue/no-v-html -->
    <p class="text-gray-darker dark:text-gray-lightest overflow-hidden leading-loose pl-12" v-html="extract" />
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
    date: {
      type: String,
      required: true,
      default: () => '',
    },
  },
  computed: {
    language() {
      return ((this.lang + '').toLowerCase() === 'en' && 'English') || 'Spanish'
    },
  },
}
</script>
