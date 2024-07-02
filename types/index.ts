import type { ParsedContent } from '@nuxt/content'

export type PostInList = {
  _path: string
  lang: string
  title: string
  summary: string
  tags: string[]
}

export type Post = ParsedContent &
  PostInList & {
    thumbnail: string
    date: string
    description: string
  }
