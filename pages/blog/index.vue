<template>
  <section>
    <the-title>
      <h1 slot="title" class="text-3xl">{{ title }}</h1>
    </the-title>
    <article-list :articles="posts"></article-list>
  </section>
</template>

<script>
const TheTitle = () => import('~/components/main-presentation/base-texts/the-title')
const ArticleList = () => import('~/components/main-presentation/article-list')

const title = 'Blog'

export default {
  name: title,
  head: {
    title,
    meta: [
      { hid: 'description', name: 'description',
        content: 'Blog - Web development related posts by Paul Melero. Frontend developer located in Barcelona.'
      }
    ]
  },
  data() {
    // Using webpacks context to gather all files from a folder
    const context = require.context('~/content/blog/posts/', false, /\.json$/);
    const posts = context.keys().map(key => ({
      ...context(key),
      _path: `/blog/${key.replace('.json', '').replace('./', '')}`
    }));
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