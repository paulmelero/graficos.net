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

const { allTags } = useBlogTags()

const { data: posts } = await useAsyncData(`posts-${tag.value}`, () => {
  return queryCollection('blog')
    .select('path', 'title', 'lang', 'summary', 'tags')
    .where('tags', 'LIKE', `%${tag.value}%`)
    .all()
    .then((res) => {
      return res.filter((post) => {
        return (post.tags || []).map((s) => s.toLowerCase()).includes(tag.value.toLowerCase())
      })
    })
})

const tags = computed(() => {
  if (!posts.value) return {}
  
  // Get all unique tags from the filtered posts
  const relatedTagNames = new Set<string>()
  posts.value.forEach(post => {
    (post.tags || []).forEach(t => relatedTagNames.add(t.toLowerCase()))
  })

  // Build a tag record using the GLOBAL counts for these related tags
  const relatedTags: Record<string, number> = {}
  relatedTagNames.forEach(tagName => {
    relatedTags[tagName] = allTags.value[tagName] || 0
  })
  
  return relatedTags
})
</script>
