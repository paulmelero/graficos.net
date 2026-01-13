import { useHead } from '#imports'

export const useCanonicalUrl = (routeFullPath: string) => {
  const { APP_URL } = useRuntimeConfig().public
  useHead({
    link: [
      {
        rel: 'canonical',
        href: new URL(routeFullPath, APP_URL).href,
      },
    ],
  })
}
