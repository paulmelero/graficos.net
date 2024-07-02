// https://github.com/aaronpk/webmention.io#find-links-of-a-specific-type-to-a-specific-page

export default defineNuxtRouteMiddleware(to) {
  if (import.meta.client) {
    const path = String(route.fullPath).replace('localhost:3000', 'graficos.net')
    fetch(
      `https://webmention.io/api/mentions.jf2?target=https://${env.APP_NAME + route.fullPath}&token=${
        env.WEBMENTIONS_TOKEN
      }&sort-by=updated&&wm-property[]=in-reply-to&wm-property[]=like-of&wm-property[]=repost-of&wm-property[]=mention-of`
    )
      .then(response => response.json())
      .then(response => {
        store.dispatch('webmention/setWebMentions', response)
      })
  }
}
