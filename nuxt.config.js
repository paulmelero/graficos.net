const glob = require('glob-all')
const path = require('path')

const pkg = require('./package')
const tailwindConfig = require('./tailwind.config')

const socialLinks = require('./assets/social-links')

const APP_NAME = 'Graficos.net'
const APP_URL = 'graficos.net'
const APP_COVER_IMG = '/cover.png';
const THEME_COLOR = tailwindConfig.colors['teal-light']

const importScripts = [
  '/my-sw.js'
]

const dynamicRoutes  = getDynamicPaths({
  '/blog': 'blog/posts/*.json'
});

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: titleChunk => {
      return titleChunk ? `${titleChunk} - Paul Melero's CV` : `Paul Melero's CV`
    },
    htmlAttrs: { lang: 'en' },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description },
      // PWA
      { name: 'msapplication-TileColor', content: '#2b5797' },
      { name: 'apple-mobile-web-app-title', content: APP_NAME },
      { name: 'application-name', content: APP_NAME },
      { name: 'theme-color', content: THEME_COLOR },
      // Social OG
      { property: 'og:type', content: 'profile' },
      { property: 'og:title', content: APP_NAME },
      { property: 'og:url', content: APP_URL },
      { property: 'og:image', content: APP_URL + APP_COVER_IMG },
      { property: 'og:image:width', content: '791' },
      { property: 'og:image:height', content: '399' },
      { property: 'profile:first_name', content: 'Paul' },
      { property: 'profile:last_name', content: 'Melero' },
      // Twitter
      { property: 'twitter:title', content: APP_NAME },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:description', content: pkg.description },
      { name: 'twitter:site', content: '@paul_melero' },
      { name: 'twitter:creator', content: '@paul_melero' },
      { name: 'twitter:image:src', content: APP_URL + APP_COVER_IMG },
      // Search engines
      { name: 'image', content: APP_URL + APP_COVER_IMG },
      // Schema.org for Google
      { itemprop: 'name', content: APP_NAME },
      { itemprop: 'description', content: pkg.description },
      { itemprop: 'image', content: APP_URL + APP_COVER_IMG },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico?v=1' },
    ]
  },
  /*
  ** Load global CSS
  */
  css: [
    'prismjs/themes/prism.css',
    '@/assets/css/tailwind.css',
    '@/assets/css/main.css',
  ],
  /*
  ** This option is given directly to the vue-router Router constructor
  */
  router: {
    base: '',
    linkActiveClass: 'is-active'
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: THEME_COLOR },
  /*
    ** Build configuration
    */
  plugins: [
    '~/plugins/prism',
  ],
  modules: [
    ['@nuxtjs/axios'],
    ['nuxt-purgecss'],
    ['@nuxtjs/pwa', { icon: false, oneSignal: false }],
  ],
  /*
  ** @nuxt/axios module configuration
  */
 axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },
  /*
  ** nuxt-purgecss module configuration
  */
  purgeCSS: {
    // See https://github.com/Developmint/nuxt-purgecss
    mode: 'postcss',
    // https://github.com/FullHuman/purgecss/issues/67
    // https://github.com/Developmint/nuxt-purgecss/issues/14
    whitelistPatterns: [/^(lang)/, /token/gm]
  },
  workbox: {
    offlineAssets: ['/logo/graficos.svg']
  },
  build: {
    extractCSS: true,
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  env: {
    APP_NAME,
    social: {
      ...socialLinks
    }
  },
  /*
  ** Dynamic Routes added
  */
  generate: {
    routes: dynamicRoutes
  },
}
/**
 * Create an array of URLs from a list of files
 * @param {*} urlFilepathTable
 */
function getDynamicPaths(urlFilepathTable) {
  return [].concat(
    ...Object.keys(urlFilepathTable).map(url => {
      var filepathGlob = urlFilepathTable[url];
      return glob
        .sync(filepathGlob, { cwd: 'content' })
        .map(filepath => `${url}/${path.basename(filepath, '.json')}`);
    })
  );
}
