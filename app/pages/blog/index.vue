<template>
  <div class="post-container mx-auto">
    <BaseTextsTheTitle class="mb-24">
      <h1 class="text-3xl">{{ title }}</h1>
      <template #subtitle>
        <p class="text-lg text-gray-dark dark:text-gray-light">
          Where I share my thoughts and experiences about web development, programming, technology, and more.
        </p>
      </template>
    </BaseTextsTheTitle>
    <section class="sm:flex sm:justify-between">
      <blog-article-list v-if="posts" :articles="posts" />
      <aside class="sm:mt-0 mt-6 sm:ml-6 sm:sticky h-max sm:top-24 sm:max-w-56">
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

const { allTags } = useBlogTags()

const { data: posts } = await useAsyncData<PostInList[]>('blog', async () => {
  const content = await queryCollection('blog')
    .select('path', 'title', 'lang', 'summary', 'tags', 'date')
    .order('path', 'DESC')
    .all()

  return content as PostInList[]
})

const tags = allTags
</script>

<style scoped>
.top-2 {
  top: 2em;
}
</style>
