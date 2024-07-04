<template>
  <section class="w-3/4 sm:w-1/2 mx-auto py-4">
    <base-texts-the-title>
      <h1 class="text-3xl">{{ page.title }}</h1>
    </base-texts-the-title>
    <article class="article-post relative z-1">
      <div v-if="page" class="sm:text-lg">
        <ContentRenderer :value="page" class="py-10" />
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
import type { Post } from '~/types'

definePageMeta({
  layout: 'post',
})

const route = useRoute()

// Page
const { data } = await useAsyncData('post', () =>
  queryContent('slashes')
    .where({ _path: { $match: route.path } })
    .findOne()
)
const page = computed(() => data.value as Post)

// Head - SEO
useContentHead(page)
</script>
