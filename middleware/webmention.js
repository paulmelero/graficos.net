// https://github.com/aaronpk/webmention.io#find-links-of-a-specific-type-to-a-specific-page

export default async function({ route, store, env, $axios }) {
  const likes = await $axios.$get(
    `https://webmention.io/api/mentions.jf2?target=${env.APP_URL + route.fullPath + '/'}&token=${
      env.WEBMENTIONS_TOKEN
    }&sort-by=updated`
  )
  store.dispatch('webmention/setWebMentions', likes)
}
