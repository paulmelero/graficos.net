

const path = require('path')
const glob = require('glob-all')

const pkg = require('./package')
const tailwindConfig = require('./tailwind.config')

const socialLinks = require('./assets/social-links')

const createRSSFeed = require('./core/createRSSFeed')

const APP_NAME = 'Graficos.net'
const APP_URL = 'https://graficos.net' // do not end it in slash
const APP_COVER_IMG = '/cover.png';
const THEME_COLOR = tailwindConfig.colors['teal-light']

const FEED_FILE_NAME = 'feed.xml'
const AUTHOR = '@paul_melero'
const AUTHOR_EMAIL = 'paulmelero@gmail.com'

const dynamicRoutes  = getDynamicPaths({
  '/blog': 'blog/posts/*.json'
});

const isProd = process.env.NODE_ENV === 'production';

const envDependantModules =
  isProd ?
    [
      ['@nuxtjs/pwa', { oneSignal: false }]
    ] :
      [];

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: titleChunk => {
      return titleChunk ? `${titleChunk} - Graficos.net` : `Graficos.net`
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
      // Schema.org for Google
      { hid: 'itemprop-name', itemprop: 'name', content: APP_NAME },
      { hid: 'itemprop-description', itemprop: 'description', content: pkg.description },
      { hid: 'itemprop-image', itemprop: 'image', content: APP_URL + APP_COVER_IMG },
      // Google
      { name: 'google-site-verification', content: 'i9WbOFWpz5buDSxx-_jC7DjtnD8Xrin3p2lPHhBOlkM' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico?v=1' },
      { hid: 'publisher', rel: 'publisher', href: APP_URL },
    ]
  },
  /*
  ** Load global CSS
  */
  css: [
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
    // '~/plugins/prism',
  ],
  modules: [
    ['@nuxtjs/axios'],
    ['nuxt-purgecss'],
    ['@nuxtjs/feed'],
    ['@nuxtjs/sitemap'],
    ...envDependantModules,
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
  /*
  ** @nuxt/pwa module configuration
  */
  workbox: {
    offlineAssets: ['/logo/graficos.svg']
  },
  /*
  ** @nuxt/feed module configuration
  */
  feed: [ {
      path: '/' + FEED_FILE_NAME, // The route to your feed.
      cacheTime: 1000 * 60 * 15, // How long should the feed be cached
      async create(feed) {
        await Promise.resolve(
          createRSSFeed(
            feed,
            APP_URL + '/' + FEED_FILE_NAME,
            AUTHOR,
            AUTHOR_EMAIL,
            APP_URL,
            APP_URL,
            APP_NAME,
            pkg.description,
            APP_URL + APP_COVER_IMG,
            'Graficos.net',
          )
        )
      },
      type: 'rss2', // Can be: rss2, atom1, json1
    }
  ],
  sitemap: {
    hostname: APP_URL,
    exclude: [
      '/admin/**',
      '/thank-you'
    ],
    generate: true,
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
  watch: [
    '~/tailwind.config.js',
    'core'
  ],
  env: {
    APP_NAME,
    APP_URL,
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
