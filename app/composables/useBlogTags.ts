import type { PostInList } from '~/types'

export const useBlogTags = () => {
  const allTags = useState<Record<string, number>>('blog-tags', () => ({}))

  const getTagsFromPosts = (posts: PostInList[]) => {
    return posts.reduce(
      (acc, post) => {
        return (post.tags || []).reduce((acc, tag) => {
          if (!tag) return acc
          const normalizedTag = tag.toLowerCase()
          if (!acc[normalizedTag]) {
            acc[normalizedTag] = 1
          } else {
            acc[normalizedTag]++
          }
          return acc
        }, acc)
      },
      {} as Record<string, number>
    )
  }

  return {
    allTags,
    getTagsFromPosts,
  }
}
