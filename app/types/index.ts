import type { BlogCollectionItem } from '@nuxt/content'

export type Post = Pick<
  BlogCollectionItem,
  'title' | 'summary' | 'description' | 'tags' | 'lang' | 'date' | 'thumbnail' | 'body'
>

export type PostInList = Pick<BlogCollectionItem, 'path' | 'title' | 'summary' | 'tags' | 'lang' | 'date'>
