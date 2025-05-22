<template>
  <section class="container mx-auto py-4">
    <base-texts-the-title>
      <h1 class="text-3xl">{{ page.title }}</h1>
    </base-texts-the-title>
    <article class="article-post">
      <div v-if="page" class="sm:text-lg">
        <ContentRenderer :value="page" class="py-10" />
      </div>
    </article>
  </section>
</template>

<script lang="ts" setup>
import type { Post } from '~/types'

definePageMeta({
  layout: 'post',
})

const route = useRoute()

// Page
const { data } = await useAsyncData(`slash-${route.path}`, () =>
  queryContent('slashes')
    .where({ _path: { $match: route.path } })
    .findOne()
)
const page = computed(() => data.value as Post)

// Head - SEO
useContentHead(page)
</script>
