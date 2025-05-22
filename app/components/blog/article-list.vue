<template>
  <ul class="w-full mb-4 flex flex-col">
    <li v-for="(article, i) in articles">
      <blog-article-card
        :key="i"
        :lang="article.lang"
        :title="article.title"
        :url="article.path"
        :extract="article.summary"
        :date="article.date"
        class="mb-8"
      />
    </li>
  </ul>
</template>

<script lang="ts" setup>
import type { PostInList } from '~/types'

defineProps<{
  articles: PostInList[]
}>()
</script>
