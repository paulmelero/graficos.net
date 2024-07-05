// import { theme } from './tailwind.config'

import socialLinks from './config/social-links'

const APP_NAME = 'Graficos.net'
const APP_URL = 'https://graficos.net' // do not end it in slash

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      APP_NAME,
      APP_URL,
      WEBMENTIONS_TOKEN: 'iNlunTkDd9uJ93CWoVrhYw',
      socialLinks,
    },
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/content' /* "@vite-pwa/nuxt" */,
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@nuxt/devtools',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    '@nuxt/icon',
    'nuxt-svgo',
  ],
  colorMode: {
    classSuffix: '',
  },
  icon: {
    mode: 'svg',
    serverBundle: {
      collections: ['octicons'],
    },
  },
  content: {
    highlight: {
      theme: {
        default: 'min-light',
        dark: 'github-dark',
      },
      langs: ['json', 'js', 'ts', 'html', 'css', 'vue', 'shell', 'mdc', 'md', 'yaml', 'bash', 'ps1'],
    },
  },
  svgo: {
    svgo: false,
  },
})
