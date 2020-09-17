<template>
  <div class="relative z-1">
    <the-title dense>
      <h1 slot="title" class="text-3xl">
        Blog posts on <span class="capitalize">"{{ title }}"</span>
      </h1>
    </the-title>
    <go-back />
    <section class="sm:flex sm:justify-between">
      <article-list class="max-w-3xl" :articles="posts"></article-list>
      <aside class="sm:flex-1 sm:mt-0 mt-6 sm:ml-6">
        <tag-cloud sectionTitle="Related Tags" :tags="tags" class="mb-8" />
        <ad-tag />
      </aside>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { webpackGetPosts, getTagsFromPosts } from '~/core/posts'

const TheTitle = () => import('~/components/base-texts/the-title')
const ArticleList = () => import('~/components/blog/article-list')
const TagCloud = () => import('~/components/blog/tag-cloud')
const AdTag = () => import('~/components/blog/ad-tag')
const GoBack = () => import('@/components/base-texts/go-back')

export default {
  name: 'Tag',
  transition: 'page-left',
  head: {
    title: `${(this && this.title) || 'Tag'}`,
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'Tag - Web development related posts by Paul Melero. FrontEnd developer located in Barcelona.',
      },
    ],
  },
  data() {
    return {
      title: '',
      posts: [],
    }
  },
  asyncData({ params }) {
    const filterPosts = posts => posts.filter(post => [...post.tags].includes(params.tag))
    const { posts } = webpackGetPosts({ callback: filterPosts })
    return {
      title: params.tag,
      posts: posts,
    }
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
    GoBack,
  },
}
</script>
