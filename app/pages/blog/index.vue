<template>
  <div class="">
    <base-texts-the-title>
      <h1 class="text-3xl">{{ title }}</h1>
    </base-texts-the-title>
    <section class="sm:flex sm:justify-between">
      <blog-article-list v-if="posts" :articles="posts" />
      <aside class="sm:mt-0 mt-6 sm:ml-6 sm:sticky top-2 sm:max-w-56">
        <blog-tag-cloud :tags="tags" :shouldHide="true" />
      </aside>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { PostInList } from '~/types'

const title = 'Blog'

useSeoMeta({
  title,
  description: 'Blog - Web development related posts by Paul Melero. FrontEnd developer located in Barcelona.',
})

const getTagsFromPosts = (posts: PostInList[]) => {
  return posts
    .map((post) => post.tags)
    .reduce((acc, tags) => [...acc, ...(tags || [])])
    .reduce((acc, tag, i) => {
      if (!tag) return acc
      tag.toLowerCase()
      if (acc[tag]) {
        acc[tag]++
      } else {
        acc[tag] = 1
      }
      return acc
    }, {} as Record<string, number>)
}

const { data } = await useAsyncData('blog', () =>
  queryContent('blog')
    .only(<(keyof PostInList)[]>['_path', 'title', 'lang', 'summary', 'tags', 'date'])
    .sort({ date: -1 })
    .find()
)
const posts = computed(() => data.value as PostInList[])
const tags = getTagsFromPosts(posts.value)
</script>

<style scoped>
.top-2 {
  top: 2em;
}
</style>
