<template>
  <ContentList class="w-full mb-4" path="/blog">
    <div class="flex flex-col">
      <blog-article-card
        v-for="(article, i) in articles"
        :key="i"
        :lang="article.lang"
        :title="article.title"
        :url="article._path"
        :extract="article.summary"
        class="mb-8"
      ></blog-article-card>
    </div>
  </ContentList>
</template>

<script setup lang="ts">
import type { PostInList } from '~/types'

defineProps<{
  articles: PostInList[]
}>()
</script>
