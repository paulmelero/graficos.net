<template>
  <section>
    <the-title>
      <h1 slot="title" class="text-3xl">{{ title }}</h1>
    </the-title>
    <article-list></article-list>
  </section>
</template>

<script>
const TheTitle = () => import('~/components/main-presentation/the-title')
const ArticleList = () => import('~/components/main-presentation/article-list')
const title = 'Blog'
export default {
  head: {
    title,
    meta: [
      { hid: 'description', name: 'description',
        content: 'Blog - Web development related posts by Paul Melero. Frontend developer located in Barcelona.'
      }
    ]
  },
  data() {
    return {
      title
    }
  },
  components: {
    TheTitle,
    ArticleList,
  }
}
</script>