<template>
  <div>
    <the-title>
      <h1 slot="title" class="text-3xl">{{ title }}</h1>
    </the-title>
    <section class="sm:flex sm:justify-between">
      <article-list class="max-w-lg" :articles="posts"></article-list>
      <aside class="sm:flex-1 sm:mt-0 mt-6 sm:ml-6">
        <tag-cloud
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

const title = 'Blog'

export default {
  name: title,
  transition: 'page-opacity',
  head: {
    title,
    meta: [
      { hid: 'description', name: 'description',
        content: 'Blog - Web development related posts by Paul Melero. FrontEnd developer located in Barcelona.'
      }
    ]
  },
  data() {
    const posts = webapackGetPosts()
    return {
      title,
      posts
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
