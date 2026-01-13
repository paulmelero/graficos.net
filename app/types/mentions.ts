export interface MentionResponseFromApi {
  type: string
  name: string
  children: MentionChildren[]
}

export interface MentionChildren {
  type: string
  author: MentionAuthor
  url: string
  published: any
  'wm-received': string
  'wm-id': number
  'wm-source': string
  'wm-target': string
  'wm-protocol': string
  'mention-of': string
  'wm-property': string
  'wm-private': boolean
}

export interface MentionAuthor {
  type: string
  name: string
  photo: string
  url: string
}

export type MentionResponse = {
  mentionsNumber: number
  mentionsAvatars: string[]
  mentions: MentionResponseFromApi
}
