<template>
  <section>
    <the-title>
      <h1 slot="title" class="text-3xl">{{ title }}</h1>
    </the-title>
    <article-list :articles="posts"></article-list>
  </section>
</template>

<script>
import { webapackGetPosts } from '~/core/posts/'

const TheTitle = () => import('~/components/base-texts/the-title')
const ArticleList = () => import('~/components/blog/article-list')

const title = 'Blog'

export default {
  name: title,
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
  /* computed: {
    tags() {
      return this.posts
        .map(post => post.tags)
        .flat()
        .reduce((acc, tag, i, arr) => {
          if (!tag) return acc
          return acc[tag] ? (acc[tag] + 1) : acc.tag = 1 && acc
        }, {})
    }
  }, */
  components: {
    TheTitle,
    ArticleList,
  }
}
</script>