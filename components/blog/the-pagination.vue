<template>
  <div class="py-8 flex my-8 title font-thin">
    <div v-for="page of numberofPagesNeeded" :key="page">
      <nuxt-link title="Go to blog's first page" v-if="page !== 1" class="card disable-underline " to="/blog"
        >1</nuxt-link
      >
      <nuxt-link
        :title="`Go to page number ${page}`"
        v-if="page !== 1"
        class="card disable-underline"
        :to="`/blog/page/${page}`"
        >{{ page }}</nuxt-link
      >
    </div>
  </div>
</template>

<script>
import { POSTS_PER_PAGE } from '~/core/posts'
export default {
  props: {
    totalPosts: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    numberofPagesNeeded() {
      return Math.ceil(this.totalPosts / POSTS_PER_PAGE)
    },
  },
}
</script>
