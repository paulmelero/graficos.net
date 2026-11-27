// Brings Nitro types and module augmentations (routeRules, nitro config) into NuxtConfig.
// oxlint-disable-next-line typescript/triple-slash-reference -- path references have no import equivalent
/// <reference path=".nuxt/nuxt.node.d.ts" />

import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineNuxtConfig } from 'nuxt/config'

import { collectionCategories } from './app/config/collections'
import socialLinks from './app/config/social-links'

const APP_NAME = 'graficos.net'
const APP_URL = 'https://graficos.net' // do not end it in slash

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-20',
  devtools: { enabled: true },
  builder: 'rsbuild',

  devServer: {
    port: 1337,
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      APP_NAME,
      APP_URL,
      NEWSLETTER_URL: 'https://newsletter.graficos.net', // do not end it in slash
      WEBMENTIONS_TOKEN: 'iNlunTkDd9uJ93CWoVrhYw',
      socialLinks,
    },
  },

  experimental: {
    inlineRouteRules: true,
    clientNodeCompat: true,
    inlineSSRStyles: false,
    staticRoutes: true,
    viteEnvironmentApi: true,
  },

  nitroLegacy: false,

  nitro: {
    ...(process.env.NODE_ENV === 'production'
      ? {}
      : {
          alias: {
            'sqlite3.wasm': fileURLToPath(new URL('server/sqlite3-wasm.cjs', import.meta.url)),
          },
        }),
    prerender: {
      autoSubfolderIndex: false,
      // Dumps are only used by static Content clients; this app queries D1 at runtime.
      ignore: ['/__nuxt_content/**'],
      routes: ['/feed', ...collectionCategories.map((category) => `/collections/${category.slug}`)],
    },
    // Cloudflare's dev emulation runs the server in workerd, where some dev-only
    // dependencies (TypeScript's inspector hook) cannot load.
    preset: process.env.NODE_ENV === 'production' ? 'cloudflare_module' : undefined,
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
  },

  routeRules: {
    '/': { prerender: true },
    '/blog': { prerender: true },
    '/blog/**': { prerender: true },
    '/collections': { prerender: true },
    '/collections/**': { prerender: true },
    '/contact': { prerender: true },
    '/newsletter': { prerender: true },
    '/newsletter/drops': { prerender: true },
    '/privacy': { prerender: true },
    '/slashes': { prerender: true },
    '/slashes/**': { prerender: true },
  },

  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
    },
  },

  hooks: {
    // Rsbuild parses @nuxt/content's virtual components template as JavaScript, so drop the only TS annotations.
    ready: (nuxt) => {
      const template = nuxt.options.build.templates.find((t) => t.filename === 'content/components.ts')
      const getContents = template?.getContents
      if (typeof getContents === 'function') {
        template.getContents = async (context) => {
          const base = resolve(context.nuxt.options.buildDir, 'content')
          return (await getContents(context))
            .replaceAll(': string[]', '')
            .replaceAll(/(import\(")(\.[^"]+)("\))/g, (_, start, path, end) => `${start}${resolve(base, path)}${end}`)
        }
      }
    },
  },

  modules: [
    '@nuxt/test-utils/module',
    'nuxt-content-twoslash',
    '@nuxt/content',
    '@nuxt/image',
    '@nuxtjs/color-mode',
    'nuxt-svgo',
    '@nuxt/fonts',
    '@vueuse/nuxt',
    // Runs after @nuxt/content, whose Nitro hook installs the local SQLite adapter.
    function contentCloudflareLocalAdapter(_options, nuxt) {
      nuxt.hook('nitro:config', (config) => {
        // @nuxtjs/color-mode still uses Nitro v2's externals.inline.
        const externals = (config as { externals?: { inline?: string[] } }).externals
        if (externals && Object.keys(externals).every((key) => key === 'inline')) {
          config.noExternals = [
            ...(Array.isArray(config.noExternals) ? config.noExternals : []),
            ...(externals.inline ?? []),
          ]
          delete (config as { externals?: unknown }).externals
          delete (nuxt.options.nitro as { externals?: unknown }).externals
        }

        if (config.preset?.startsWith('cloudflare')) {
          config.alias ||= {}
          config.alias['#content/local-adapter'] = fileURLToPath(
            new URL('server/content-local-adapter.stub.ts', import.meta.url)
          )
        }
      })
    },
  ],

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

  fonts: {
    provider: 'google',
    defaults: {
      weights: [100, 400, 600, 700, 900],
      styles: ['italic', 'normal'],
      subsets: ['latin'],
    },
    families: [
      { name: 'Montserrat', weights: ['900'], styles: ['italic'] },
      { name: 'IBM Plex Mono' },
      { name: 'IBM Plex Sans' },
    ],
  },
})
