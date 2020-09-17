<template>
  <div>
    <the-title>
      <h1 slot="title" class="text-3xl">{{ title }}</h1>
    </the-title>
    <section class="sm:flex sm:justify-between">
      <article-list class="max-w-3xl" :articles="posts"></article-list>
      <aside class="sm:flex-1 sm:mt-0 mt-6 sm:ml-6">
        <tag-cloud v-if="tags" :tags="tags" />
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
const GoBack = () => import('@/components/base-texts/go-back')

const title = 'Blog'

export default {
  computed: {
    tags() {
      return this.posts && this.posts.length && getTagsFromPosts(this.posts)
    },
    title() {
      return `Blog (Page ${this.page})`
    },
  },
  head: {
    title: (this && this.title) || title,
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: `- Web development related posts by Paul Melero. FrontEnd developer located in Barcelona.`,
      },
    ],
  },
  asyncData({ params, redirect }) {
    const page = +params.page
    if (page === 1) {
      redirect('/blog')
    }
    const callbackFunction = posts => filterByPage(posts, page)
    const { posts, totalPosts } = webpackGetPosts({ callback: callbackFunction })
    return { posts: Object.freeze(posts), totalPosts, page }
  },
  components: {
    TheTitle,
    ArticleList,
    TagCloud,
    AdTag,
    ThePagination,
    GoBack,
  },
}
</script>
