import socialLinks from './app/config/social-links'

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
      TWITTER_USERNAME: 'paul_melero',
    },
  },

  modules: [
    '@nuxt/test-utils/module',
    '@nuxt/eslint', // this needs to be before `@nuxt/content`
    'nuxt-content-twoslash',
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@nuxt/devtools',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    '@nuxt/icon',
    'nuxt-svgo',
    '@vueuse/nuxt',
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
    defaultImport: 'component',
  },

  compatibilityDate: '2024-07-17',
  future: {
    compatibilityVersion: 4,
  },
})
