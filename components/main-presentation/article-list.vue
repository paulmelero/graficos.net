<template>
  <div class="container">
    <h2 v-if="articles.length">list</h2>
    <article
      class="w-full"
      v-for="(article, i) in articles"
      :key="i"
    >
      <h1>{{ article.title }}</h1>
      <p>{{ article.extract }}</p>
    </article>
  </div>
</template>

<script>
export default {
  data() {
    return {
      articles: []
    }
  },
  asyncData() {
    return {
      articles: [
        {
          title: 'a',
          extract: 'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum '
        }
      ]
    }
  }
}
</script>

