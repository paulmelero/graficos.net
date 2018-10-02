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
    ></article-card>
  </section>
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
        // const tags = []
        return (
          text.replace(
            /([#\*=_<>`\[\]]+?)|(\(.+\))|[\.\s]+$/gi, // TODO, escape html tags
            ''
          ).replace(/\s\s/, ' ')
          .replace(/\s,/, ',')
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
