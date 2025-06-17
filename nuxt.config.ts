import wasm from 'vite-plugin-wasm'

import socialLinks from './app/config/social-links'

const APP_NAME = 'Graficos.net'
const APP_URL = 'https://graficos.net' // do not end it in slash

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-06-14',
  devtools: { enabled: true },

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

  future: {
    compatibilityVersion: 4,
  },

  experimental: {
    inlineRouteRules: true,
    granularCachedData: true,
  },

  nitro: {
    prerender: {
      autoSubfolderIndex: false,
    },
    preset: 'cloudflare_module',
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
  },

  vite: {
    plugins: [wasm()],
  },

  routeRules: {
    '/': { prerender: true },
    '/blog': { prerender: true },
    '/blog/**': { prerender: true },
    '/contact': { prerender: true },
    '/slashes': { prerender: true },
    '/slashes/**': { prerender: true },
  },

  modules: [
    'nitro-cloudflare-dev',
    '@nuxt/test-utils/module',
    '@nuxt/eslint', // this needs to be before `@nuxt/content`
    'nuxt-content-twoslash',
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    'nuxt-svgo',
    '@vueuse/nuxt',
  ],

  colorMode: {
    classSuffix: '',
  },

  content: {
    database: { bindingName: 'D1', type: 'd1' },
    build: {
      markdown: {
        highlight: {
          theme: {
            default: 'min-light',
            dark: 'github-dark',
          },
          langs: ['diff', 'json', 'js', 'ts', 'html', 'css', 'vue', 'shell', 'mdc', 'md', 'yaml', 'bash', 'ps1'],
        },
      },
    },
  },

  svgo: {
    svgo: false,
    defaultImport: 'component',
  },
})
