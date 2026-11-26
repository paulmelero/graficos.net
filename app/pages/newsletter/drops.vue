<template>
  <div class="post-container mx-auto">
    <BaseTextsTheTitle class="mb-24">
      <h1 class="text-2xl sm:text-3xl">Drops</h1>
      <template #subtitle>
        <p class="text-lg text-gray-dark dark:text-gray-light">Every GRAFICOZZ Drop, newest first.</p>
      </template>
    </BaseTextsTheTitle>

    <blog-article-list v-if="drops?.length" :articles="drops" />
    <p v-else class="font-ibm">No Drops yet.</p>

    <p class="mt-10 font-ibm">
      <NuxtLink to="/newsletter">Get the next Drop by email</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import type { PostInList } from '~/types'

const { data: drops } = await useAsyncData<PostInList[]>('newsletter-drops', async () => {
  const content = await queryCollection('newsletter')
    .select('path', 'title', 'summary', 'date', 'draft')
    .order('date', 'DESC')
    .all()

  return content
    .filter((drop) => !drop.draft)
    .map((drop) => ({
      path: drop.path,
      title: drop.title,
      summary: drop.summary,
      tags: [],
      lang: '',
      date: drop.date,
    }))
})

useSeoMeta({
  title: 'Drops',
  description: 'Every GRAFICOZZ Drop, newest first.',
})
</script>
