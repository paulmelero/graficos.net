import type { MentionResponse, MentionResponseFromApi } from '~/types/mentions'

export const useMentions = (routeFullPath: string) => {
  const { APP_NAME, WEBMENTIONS_TOKEN } = useRuntimeConfig().public

  const { data: mentions } = useAsyncData<MentionResponseFromApi, unknown, MentionResponse>(
    `mentions-${routeFullPath}`,
    () =>
      $fetch<MentionResponseFromApi>(
        `https://webmention.io/api/mentions.jf2?target=https://${APP_NAME + routeFullPath}&token=${
          WEBMENTIONS_TOKEN
        }&sort-by=updated&&wm-property[]=in-reply-to&wm-property[]=like-of&wm-property[]=repost-of&wm-property[]=mention-of`
      ),
    {
      transform: (data) => {
        const mentionsNumber = data.children.length
        const mentionsAvatars = data.children.map((child) => child.author.photo).filter(Boolean)
        return {
          mentionsNumber,
          mentions: data,
          mentionsAvatars,
        } satisfies MentionResponse
      },
    }
  )

  return mentions
}
