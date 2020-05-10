import path from 'path'
import globAll from 'glob-all'
import PurgecssPlugin from 'purgecss-webpack-plugin'

import pkg from './package'
import tailwindConfig from './tailwind.config'

import socialLinks from './assets/social-links'
import tailwindJS from './tailwind.config'

import createRSSFeed from './core/createRSSFeed'
import { getTagsFromPosts, POSTS_PER_PAGE } from './core/posts'

const isProd = process.env.NODE_ENV === 'production'

const APP_NAME = 'Graficos.net'
const APP_URL = 'https://graficos.net' // do not end it in slash
const APP_COVER_IMG = '/cover.png'
const THEME_COLOR = tailwindConfig.colors['teal-light']

const FEED_FILE_NAME = 'feed.xml'
const AUTHOR = '@paul_melero'
const AUTHOR_EMAIL = 'paul' + '@graficos' + '.' + 'net'

const blogPaths = getPathFromGlob({
  '/blog': 'blog/posts/*.json',
})

const blogPostRoutes = getRoutesFromPosts(blogPaths)

const tagsRoutes = getRoutesFromPostTags(blogPaths)

const pagesRoutes = getBlogPagesRoutes(blogPaths)

const envDependantModules = isProd
  ? [
      ['@nuxtjs/pwa', { oneSignal: false }],
      [
        'nuxt-netlify-http2-server-push',
        {
          // Specify relative path to the dist directory and its content type
          resources: [{ path: '_nuxt/*.css', as: 'style' }],
        },
      ],
    ]
  : []

export default {
  mode: 'universal',
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
      { name: 'google-site-verification', content: 'i9WbOFWpz5buDSxx-_jC7DjtnD8Xrin3p2lPHhBOlkM' },
    ],
    link: [
      { hid: 'publisher', rel: 'publisher', href: APP_URL },
      { hid: 'webmention', rel: 'webmention', href: 'https://webmention.io/graficos.net/webmention' },
      { hid: 'pingback', rel: 'pingback', href: 'https://webmention.io/graficos.net/xmlrpc' },
      // preconnect
      { rel: 'preconnect', href: 'https://storage.googleapis.com/', crossorigin: 'crossorigin' },
    ],
  },
  /*
   ** Load global CSS
   */
  css: ['@/assets/css/tailwind.css', '@/assets/css/main.css'],
  /*
   ** This option is given directly to the vue-router Router constructor
   */
  router: {
    base: '',
    linkActiveClass: 'is-active',
  },
  /*
   ** Customize the progress bar color
   */
  loading: {
    color: THEME_COLOR,
    height: '4px',
  },
  /*
   ** Build configuration
   */
  plugins: [
    // '~/plugins/prism',
  ],
  modules: ['@nuxtjs/feed', '@nuxtjs/sitemap', '@bazzite/nuxt-netlify', '@nuxtjs/axios', ...envDependantModules],
  /*
   ** @nuxt/axios module configuration
   */
  axios: {},
  /*
   ** @nuxt/pwa module configuration
   */
  workbox: {},
  manifest: {
    name: APP_NAME,
    start_url: '/',
    background_color: tailwindConfig.colors['grey-lightest'],
  },
  /*
   ** @nuxt/feed module configuration
   */
  feed: [
    {
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
            APP_NAME
          )
        )
      },
      type: 'rss2', // Can be: rss2, atom1, json1
    },
  ],
  /*
   ** @nuxt/sitemap module configuration
   */
  sitemap: {
    hostname: APP_URL,
    exclude: ['/admin/**', '/thank-you'],
    generate: true,
  },
  /*
   ** @bazzite/nuxt-netlify module configuration
   * Dynamically generate _headers and _redirects files for
   * Netlify in your Nuxt.js projects.
   */
  netlify: {},
  build: {
    analyze: !isProd,
    extractCSS: true,
    splitChunks: {
      layouts: true,
    },
    optimization: {
      // https://webpack.js.org/plugins/split-chunks-plugin/#splitchunkscachegroupscachegroupreuseexistingchunk
      runtimeChunk: true,
      // https://webpack.js.org/plugins/split-chunks-plugin
      splitChunks: {
        cacheGroups: {
          vendors: {
            // https://webpack.js.org/plugins/split-chunks-plugin/#splitchunkscachegroupscachegroupreuseexistingchunk
            reuseExistingChunk: true,
            // https://webpack.js.org/plugins/split-chunks-plugin/#splitchunkscachegroupscachegroupenforce
            enforce: true,
          },
        },
      },
    },
    postcss: {
      // order of requires is important!
      plugins: [
        require('postcss-import'),
        require('postcss-preset-env')({
          stage: 0,
        }),
        require('postcss-nested'),
        require('postcss-url'),
        require('tailwindcss')(tailwindJS),
        require('autoprefixer')({
          cascade: false,
          grid: true,
        }),
        require('cssnano')({
          preset: 'default',
          discardComments: { removeAll: true },
          zindex: false,
        }),
      ],
    },
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
          exclude: /(node_modules)/,
        })
      }
      // Run PurgeCSS
      if (!ctx.isDev || isProd) {
        // Remove unused CSS using purgecss.
        // See https://github.com/FullHuman/purgecss
        // for more information about purgecss.
        config.plugins.push(
          new PurgecssPlugin({
            paths: globAll.sync([
              path.join(__dirname, './pages/**/*.vue'),
              path.join(__dirname, './layouts/**/*.vue'),
              path.join(__dirname, './components/**/*.vue'),
            ]),
            whitelist: ['html', 'body', 'line-numbers', 'code-toolbar', 'nuxt-link-exact-active', 'is-active'],
            whitelistPatterns: [
              // tailwind
              /^max-w/,
              /^sm:/,
              /^md:/,
              /^lg:/,
              /^xl:/,
              // prismjs
              /^(lang)/,
              /^\.language\-/,
              /^token/,
              /^pre/,
              /^code/,
              /^svg/,
              /^img/,
              /^label/,
              /^input/,
              /^textarea/,
              /^button/,
              // carbonads
              /carbonads/,
            ],
          })
        )
      }
    },
  },
  server: {
    timing: false,
  },
  env: {
    APP_NAME,
    APP_URL,
    WEBMENTIONS_TOKEN: 'iNlunTkDd9uJ93CWoVrhYw',
    social: {
      ...socialLinks,
    },
  },
  /*
   ** Dynamic Routes added
   */
  generate: {
    routes: [...blogPostRoutes, ...tagsRoutes, pagesRoutes],
    fallback: true,
  },
}
/**
 * Return a path from glob
 * @param {*} urlFilepathTable
 */
function getPathFromGlob(urlFilepathTable) {
  return [].concat(
    ...Object.keys(urlFilepathTable).map(url => {
      var filepathGlob = urlFilepathTable[url]
      return globAll.sync(filepathGlob, { cwd: 'content' })
    })
  )
}
/**
 * Create an array of URLs from a list of file names (they are the slugs)
 * @param {String[]} articlePaths
 * @return  {String[]}  the routes to generate
 */
function getRoutesFromPosts(articlePaths) {
  return articlePaths.map(articlePath => `/blog/${path.basename(articlePath, '.json')}`)
}

/**
 * Get tags and related tags from a group of posts.
 * Generate URLs with all the used tags.
 *
 * @param {String[]} articlePaths
 *
 * @return  {String[]}  the routes to generate
 */
function getRoutesFromPostTags(articlePaths) {
  const tags = articlePaths
    .map(articlePath => require(`./content/${articlePath}`))
    .map(article => getTagsFromPosts([article]))
    .map(Object.keys)
    .reduce((acc, arr) => [...acc, ...arr], []) // flatten
  return tags.map(tagName => `/blog/tag/${tagName}`)
}

/**
 * Create an array of for the needed amount of `/blog/page/`s
 * @param {String[]} articlePaths
 * @return  {String[]}  the routes to generate
 */
function getBlogPagesRoutes(articlePaths) {
  const numberofPagesNeeded = Math.ceil(articlePaths.length / POSTS_PER_PAGE)
  return [...Array(numberofPagesNeeded).keys()]
    .map(number => number !== 0 && `/blog/page/${number + 1}`)
    .filter(Boolean)
}
