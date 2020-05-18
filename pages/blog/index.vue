<template>
  <div class="relative z-1">
    <the-title>
      <h1 slot="title" class="text-3xl">{{ title }}</h1>
    </the-title>
    <section class="sm:flex sm:justify-between">
      <article-list class="max-w-lg" :articles="posts"></article-list>
      <aside class="sm:flex-1 sm:mt-0 mt-6 sm:ml-6 sm:sticky top-2 self-start">
        <tag-cloud :tags="tags" />
        <ad-tag />
      </aside>
    </section>
    <the-pagination :totalPosts="totalPosts" />
  </div>
</template>

<script>
import { webpackGetPosts, getTagsFromPosts, filterByPage } from '~/core/posts'

const TheTitle = () => import('~/components/base-texts/the-title')
const ArticleList = () => import('~/components/blog/article-list')
const TagCloud = () => import('~/components/blog/tag-cloud')
const AdTag = () => import('~/components/blog/ad-tag')
const ThePagination = () => import('~/components/blog/the-pagination')

const title = 'Blog'

export default {
  name: title,
  transition: 'page-opacity',
  head: {
    title,
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'Blog - Web development related posts by Paul Melero. FrontEnd developer located in Barcelona.',
      },
    ],
  },
  data() {
    return {
      title,
      page: 1,
    }
  },
  asyncData() {
    const { posts, totalPosts } = webpackGetPosts({ callback: filterByPage })
    return { posts: Object.freeze(posts), totalPosts }
  },
  computed: {
    tags() {
      return getTagsFromPosts(this.posts)
    },
  },
  components: {
    TheTitle,
    ArticleList,
    TagCloud,
    AdTag,
    ThePagination,
  },
}
</script>

<style scoped>
.top-2 {
  top: 2em;
}
</style>
