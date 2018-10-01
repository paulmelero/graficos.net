<template>
  <div class="container">
    <article
      class="w-full mb-4"
      v-for="(article, i) in articles"
      :key="i"
    >
      <article-card
        :lang="article.lang"
        :title="article.title"
        :url="article._path"
        :extract="getExtract(article.body)"
      ></article-card>
    </article>
  </div>
</template>

<script>
const ArticleCard = () => import('~/components/main-presentation/article-card')

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
        const trimmedText = text.slice(0, 420)
        const cleanedText = this.cleanExtract(trimmedText)
        return (cleanedText +  '...')
      }
      return ''
    },
    cleanExtract(text) {
      if (text && typeof text === 'string') {
        return (
          text.replace(/([\*=_<>]+?)|[\.\s]+$/gi, '')
        )
      }
      return ''
    }
  },
  components: {
    ArticleCard
  }
}
</script>
