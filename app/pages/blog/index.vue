<template>
  <div class="post-container mx-auto">
    <base-texts-the-title class="mb-24">
      <h1 class="text-3xl">{{ title }}</h1>
    </base-texts-the-title>
    <section class="sm:flex sm:justify-between">
      <blog-article-list v-if="posts" :articles="posts" />
      <aside class="sm:mt-0 mt-6 sm:ml-6 sm:sticky h-max top-2 sm:max-w-56">
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
  description: 'Blog - Web development related posts by Paul Melero. Web Engineer located in Spain.',
})

const getTagsFromPosts = (posts: PostInList[]) => {
  return posts
    .map((post) => post.tags ?? [])
    .reduce((acc, tags) => [...acc, ...tags], [] as string[])
    .reduce(
      (acc, tag) => {
        if (!tag) return acc
        const lowerCaseTag = tag.toLowerCase()
        if (acc[lowerCaseTag]) {
          acc[lowerCaseTag]++
        } else {
          acc[lowerCaseTag] = 1
        }
        return acc
      },
      {} as Record<string, number>
    )
}

const { data: posts } = await useAsyncData<PostInList[]>('blog', async () => {
  const content = await queryCollection('blog')
    .select('path', 'title', 'lang', 'summary', 'tags', 'date')
    .order('path', 'DESC')
    .all()

  return content as PostInList[]
})

const tags = computed(() => (posts.value ? getTagsFromPosts(posts.value) : {}))
</script>

<style scoped>
.top-2 {
  top: 2em;
}
</style>
