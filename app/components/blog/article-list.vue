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
        :date="article.date"
        class="mb-8"
      />
    </div>
  </ContentList>
</template>

<script lang="ts" setup>
import type { PostInList } from '~/types'

defineProps<{
  articles: PostInList[]
}>()
</script>
