import { useHead } from '#imports'

export const useCanonicalUrl = (route: string) => {
  const { APP_URL } = useRuntimeConfig().public
  useHead({
    link: [
      {
        rel: 'canonical',
        href: new URL(route, APP_URL).href,
      },
    ],
  })
}
