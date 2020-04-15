// https://github.com/aaronpk/webmention.io#find-links-of-a-specific-type-to-a-specific-page

export default async function({ route, store, env, $axios }) {
  const likes = await $axios.$get(
    `https://webmention.io/api/mentions.jf2?target=${env.APP_URL + route.fullPath + '/'}&token=${
      env.WEBMENTIONS_TOKEN
    }&sort-by=updated&&wm-property[]=in-reply-to&wm-property[]=like-of&wm-property[]=repost-of&wm-property[]=mention-of`
  )
  store.dispatch('webmention/setWebMentions', likes)
}
