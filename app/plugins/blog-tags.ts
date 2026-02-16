export default defineNuxtPlugin(async () => {
  const { allTags, getTagsFromPosts } = useBlogTags()

  // Only fetch if tags haven't been populated yet
  if (Object.keys(allTags.value).length === 0) {
    const { data: allPosts } = await useAsyncData('all-blog-posts-for-tags-plugin', () => {
      return queryCollection('blog')
        .select('tags')
        .all()
    })

    if (allPosts.value) {
      allTags.value = getTagsFromPosts(allPosts.value as any)
    }
  }
})
