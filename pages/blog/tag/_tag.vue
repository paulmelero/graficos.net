<template>
  <div>
    <the-title dense>
      <h1 slot="title" class="text-3xl">Blog posts on <span class="capitalize">"{{ title }}"</span></h1>
    </the-title>
    <p class="mb-10"><nuxt-link :to="'/blog'">&lt; Come back to blog</nuxt-link></p>
    <section class="sm:flex sm:justify-between">
      <article-list class="max-w-lg" :articles="posts"></article-list>
      <aside class="sm:flex-1 sm:mt-0 mt-6 sm:ml-6">
        <tag-cloud
          sectionTitle="Related Tags"
          :tags="tags"
        ></tag-cloud>
      </aside>
    </section>
  </div>
</template>

<script>
import { webapackGetPosts, getTagsFromPosts } from '~/core/posts'

const TheTitle = () => import('~/components/base-texts/the-title')
const ArticleList = () => import('~/components/blog/article-list')
const TagCloud = () => import('~/components/blog/tag-cloud')

export default {
  name: 'Tag',
  transition: 'page-left',
  head: {
    title: `${ (this && this.title) || 'Tag' }`,
    meta: [
      { hid: 'description', name: 'description',
        content: 'Tag - Web development related posts by Paul Melero. FrontEnd developer located in Barcelona.'
      }
    ]
  },
  data() {
    return {
      title: '',
      posts: []
    }
  },
  asyncData({ params }) {
    const filterPosts = posts => posts.filter(post => [...post.tags].includes(params.tag))
    const posts = webapackGetPosts({ callback: filterPosts })
    return {
      title: params.tag,
      posts: posts
    }
  },
  computed: {
    tags() {
      return getTagsFromPosts(this.posts)
    }
  },
  components: {
    TheTitle,
    ArticleList,
    TagCloud,
  }
}
</script>
