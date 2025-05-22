<template>
  <div :key="tag">
    <base-texts-the-title>
      <h1 class="text-3xl">
        Blog posts on <span class="capitalize">"{{ tag }}"</span>
      </h1>
    </base-texts-the-title>
    <section class="sm:flex sm:justify-between">
      <blog-article-list v-if="posts" class="max-w-3xl" :articles="posts"></blog-article-list>
      <aside class="sm:flex-1 sm:mt-0 mt-6 sm:ml-6">
        <blog-tag-cloud sectionTitle="Related Tags" :tags="tags" class="mb-8" />
      </aside>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { PostInList } from '~/types'

const route = useRoute()
const tag = computed(() => route.params.tag as string)

const { data } = await useAsyncData(`posts-${tag.value}`, () => {
  return queryContent('blog')
    .only(<(keyof PostInList)[]>['_path', 'title', 'lang', 'summary', 'tags'])
    .where({ tags: { $contains: tag.value } })
    .find()
})

const posts = computed(() => data.value as PostInList[])
const tags = (posts.value || []).reduce((acc, post) => {
  return post.tags.reduce((acc, tag) => {
    if (!acc[tag]) {
      acc[tag] = 1
    } else {
      acc[tag]++
    }
    return acc
  }, acc)
}, {} as Record<string, number>)
</script>
