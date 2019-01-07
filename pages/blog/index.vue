<template>
  <section>
    <the-title>
      <h1 slot="title" class="text-3xl">{{ title }}</h1>
    </the-title>
    <article-list :articles="posts"></article-list>
  </section>
</template>

<script>
const webapackGetPosts = require('~/api/posts').webapackGetPosts

const TheTitle = () => import('~/components/main-presentation/base-texts/the-title')
const ArticleList = () => import('~/components/main-presentation/article-list')

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
  components: {
    TheTitle,
    ArticleList,
  }
}
</script>