<template>
  <div class="max-w-lg border rounded overflow-hidden shadow-md hover:shadow-lg p-6 transition:box-shadow">
    <h1 class="text-lg mb-6">
      <span v-if="!url">{{ title }}</span>
      <nuxt-link
        v-else
        :to="url"
        class="no-underline disable-underline transition:color"
      >{{ title }}</nuxt-link>
    </h1>
    <p class="text-grey-darker overflow-hidden">{{ extract }}</p>
  </div>
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
  }
}
</script>
