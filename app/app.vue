<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script lang="ts" setup>
import pkg from '../package.json'

const APP_NAME = 'Graficos.net'
const APP_URL = 'https://graficos.net' // do not end it in slash
const APP_COVER_IMG = '/cover.png'

const fonts = 'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,200;1,900&display=swap'

useHead({
  htmlAttrs: {
    lang: 'en',
  },
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Graficos.NET` : 'Graficos.NET'
  },
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { hid: 'description', name: 'description', content: pkg.description },
    // Favicons
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    { hid: 'favicon', rel: 'favicon', href: '/favicon.ico' },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    { hid: 'apple-touch-icon', rel: 'apple-touch-icon', sizes: '120x120', href: '/apple-touch-icon.png' },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    { hid: 'icon-32x32', rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    { hid: 'icon-16x16', rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    { hid: 'manifest', rel: 'manifest', href: '/site.webmanifest' },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    { hid: 'mask-icon', rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#5bbad5' },
    // Social OG
    { hid: 'og:type', property: 'og:type', content: 'profile' },
    { hid: 'og:title', property: 'og:title', content: APP_NAME },
    { hid: 'og:site_name', property: 'og:site_name', content: APP_NAME },
    { hid: 'og:url', property: 'og:url', content: APP_URL },
    { hid: 'og:image', property: 'og:image', content: APP_URL + APP_COVER_IMG },
    { hid: 'profile:first_name', property: 'profile:first_name', content: 'Paul' },
    { hid: 'profile:last_name', property: 'profile:last_name', content: 'Melero' },
    // Twitter
    { hid: 'twitter:card', name: 'twitter:card', content: 'summary' },
    { hid: 'twitter:site', name: 'twitter:site', content: '@paul_melero' },
    { hid: 'twitter:creator', name: 'twitter:creator', content: '@paul_melero' },
    { hid: 'twitter:title', name: 'twitter:title', content: APP_NAME },
    { hid: 'twitter:description', name: 'twitter:description', content: pkg.description },
    { hid: 'twitter:image', name: 'twitter:image', content: APP_URL + APP_COVER_IMG },
    { hid: 'twitter:image:src', name: 'twitter:image:src', content: APP_URL + APP_COVER_IMG },
    // Search engines
    { hid: 'image', name: 'image', content: APP_URL + APP_COVER_IMG },
    // Google
    { name: 'google-site-verification', content: 'i9WbOFWpz5buDSxx-_jC7DjtnD8Xrin3p2lPHhBOlkM' },
  ],
  link: [
    { hid: 'publisher', rel: 'publisher', href: APP_URL },
    { hid: 'webmention', rel: 'webmention', href: 'https://webmention.io/graficos.net/webmention' },
    { hid: 'pingback', rel: 'pingback', href: 'https://webmention.io/graficos.net/xmlrpc' },
    {
      rel: 'stylesheet',
      href: fonts,
    },
    // preconnect
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    { rel: 'preconnect', href: 'https://storage.googleapis.com/', crossorigin: 'crossorigin' },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'crossorigin' },
    // preload
    { rel: 'preload', href: fonts, as: 'style' },
  ],
})
</script>
