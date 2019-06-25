<template>
  <section
    class="w-full mb-4" role="region"
  >
    <article-card
      v-for="(article, i) in articles"
      :key="i"
      :lang="article.lang"
      :title="article.title"
      :url="article._path"
      :extract="getExtract(article.body)"
      class="mb-8"
    ></article-card>
  </section>
</template>

<script>
import { mdToText } from '~/core/posts';
const ArticleCard = () => import('~/components/blog/article-card')

export default {
  props: {
    articles: {
      type: Array,
      required: true
    }
  },
  methods: {
    getExtract(text) {
      if (text && typeof text === 'string') {
        const html = mdToText(text)
        const trimmedText = html.slice(0, 420)
        return (trimmedText +  '...')
      }
      return ''
    },
  },
  components: {
    ArticleCard
  }
}
</script>
