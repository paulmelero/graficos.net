<template>
  <div class="post-container mx-auto" :key="tag">
    <BaseTextsTheTitle class="mb-24">
      <h1 class="text-3xl">
        Blog posts on <span class="capitalize">"{{ tag }}"</span>
      </h1>
    </BaseTextsTheTitle>
    <section class="sm:flex sm:justify-between">
      <blog-article-list v-if="posts" :articles="posts" />
      <aside class="sm:mt-0 mt-6 sm:ml-6 sm:sticky h-max sm:top-24 sm:max-w-56">
        <blog-tag-cloud sectionTitle="Related Tags" :tags="tags" class="mb-8" />
      </aside>
    </section>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const tag = computed(() => route.params.tag as string)

const { data: posts } = await useAsyncData(`posts-${tag.value}`, () => {
  return queryCollection('blog')
    .select('path', 'title', 'lang', 'summary', 'tags')
    .all()
    .then((res) => {
      return res.filter((post) => {
        return (post.tags || []).map((s) => s.toLowerCase()).includes(tag.value.toLowerCase())
      })
    })
})

const tags = (posts.value || []).reduce(
  (acc, post) => {
    return (post.tags || []).reduce((acc, tag) => {
      if (!acc[tag]) {
        acc[tag] = 1
      } else {
        acc[tag]++
      }
      return acc
    }, acc)
  },
  {} as Record<string, number>
)
</script>
