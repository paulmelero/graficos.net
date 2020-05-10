<template>
  <section class="sm:flex sm:justify-between">
    <article-list class="max-w-lg" :articles="posts"></article-list>
    <aside class="sm:flex-1 sm:mt-0 mt-6 sm:ml-6">
      <tag-cloud v-if="tags" :tags="tags" />
      <ad-tag />
    </aside>
  </section>
</template>

<script>
import { webpackGetPosts, getTagsFromPosts, filterByPage } from '~/core/posts'

const ArticleList = () => import('~/components/blog/article-list')
const TagCloud = () => import('~/components/blog/tag-cloud')
const AdTag = () => import('~/components/blog/ad-tag')

export default {
  computed: {
    tags() {
      return this.posts && this.posts.length && getTagsFromPosts(this.posts)
    },
  },
  asyncData({ params, redirect }) {
    const page = +params.page
    if (page === 1) {
      redirect('/blog')
    }
    const callbackFunction = posts => filterByPage(posts, page)
    const { posts, total } = webpackGetPosts({ callback: callbackFunction })
    return { posts: Object.freeze(posts), total }
  },
  components: {
    ArticleList,
    TagCloud,
    AdTag,
  },
}
</script>
