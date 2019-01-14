<template>
  <article>
    <header
      class="py-16 bg-image bg-center bg-cover min-h-50 flex-col flex content-center"
      :style="`background-image: url( ${ post.thumbnail } )`"
    >
      <div class="max-w-3/4 sm:max-w-1/2 my-auto mx-auto">
        <h1 class="mb-8 text-white sm:text-5xl">{{ post.title }}</h1>
        <p class="text-white">
          <the-time :date="post.date" class="block sm:inline-block sm:text-2xl"></the-time>
          <span class="hidden sm:inline-block">·</span>
          <span class="block sm:inline-block">{{ cupsWhileReading }}️ {{ minutesToRead }} mins read</span>
        </p>
      </div>
    </header>
    <div class="max-w-3/4 sm:max-w-1/2 mx-auto py-8 sm:text-lg">
      <go-back></go-back>
    </div>
    <div v-html="parsedBody" class="max-w-3/4 sm:max-w-1/2 mx-auto py-10 sm:text-lg"></div>
    <div class="max-w-3/4 sm:max-w-1/2 mx-auto pb-10 sm:text-lg">
      <go-back></go-back>
    </div>
  </article>
</template>

<script>
import Prism from 'prismjs';
// Themes
import 'prismjs/themes/prism.css';
// Plugins
import 'prismjs/plugins/toolbar/prism-toolbar.min.js';
import 'prismjs/plugins/toolbar/prism-toolbar.css';
import 'prismjs/plugins/show-language/prism-show-language.min.js';
import 'prismjs/plugins/line-numbers/prism-line-numbers.min.js';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'prismjs/plugins/line-highlight/prism-line-highlight.min.js';
import 'prismjs/plugins/line-highlight/prism-line-highlight.css';
// Extra Languages
import 'prismjs/components/prism-yaml.min.js';

import { mdToHTML } from '@/core/posts'
const TheTime = () => import('@/components/base-texts/the-time')
const GoBack = () => import('@/components/base-texts/go-back')

export default {
  layout: 'post',
  head() {
    return {
      title: `${ (this.post && this.post.title) || 'Post' }`,
      meta: [
        {
          name: 'description',
          content: `${ (this.trimmedDescription) || '' }`,
          hid: 'description'
        },
        { hid: 'og:title', property: 'og:title', content: this.post.title },
        { hid: 'twitter:title', name: 'twitter:title', content: this.post.title },
        { hid: 'twitter:description', name: 'twitter:description', content: this.trimmedDescription },
        { hid: 'og:image', property: 'og:image', content: this.siteUrl + this.post.thumbnail },
        { hid: 'twitter:image', name: 'twitter:image', content: this.siteUrl + this.post.thumbnail },
        { hid: 'twitter:image:src', name: 'twitter:image:src', content: this.siteUrl + this.post.thumbnail },
        { hid: 'itemprop-name', itemprop: 'name', content: this.post.title },
        { hid: 'itemprop-description', itemprop: 'description', content: this.trimmedDescription },
        { hid: 'itemprop-image', itemprop: 'image', content: this.siteUrl + this.post.thumbnail },
        { hid: 'image', name: 'image', content: this.siteUrl + this.post.thumbnail },
      ],
      link: [
        { hid: 'publisher', rel: 'publisher', href: this.siteName },
      ]
    };
  },
  data() {
    return {
      post: {
        title: '',
        description: '',
        date: '',
        thumbnail: '',
        body: '',
      },
    }
  },
  async asyncData({ params, env }) {
    const post = await import('~/content/blog/posts/' + params.slug + '.json');
    const siteUrl = env.APP_URL
    const siteName = env.APP_NAME

    return { post, siteUrl, siteName };
  },
  computed: {
    parsedBody() {
      return mdToHTML(this.post.body);
    },
    trimmedDescription() {
      return (this.post.description + '').slice(0, 300)
    },
    minutesToRead() {
      return Math.floor(this.post.body.split(' ').length  * .99 / 150);
    },
    cupsWhileReading() {
      return this.minutesToRead && new Array(Math.floor(this.minutesToRead / 3)).fill('☕️').join('');
    },
  },
  mounted() {
    Prism.highlightAll(false)
  },
  components: {
    TheTime,
    GoBack,
  }
};
</script>

<style scoped>
.bg-image {
  @apply z-1 relative;
  &:after {
    content: '';
    @apply pin absolute bg-black opacity-50;
    z-index: -1;
  }
}
</style>
