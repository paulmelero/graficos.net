<template>
  <article class="article-post relative z-1">
    <header
      v-if="post && post.thumbnail"
      class="py-16 bg-image bg-center bg-cover min-h-50 flex-col flex content-center"
      :style="`background-image: url( ${post.thumbnail} )`"
    >
      <div class="w-3/4 sm:w-1/2 my-auto mx-auto">
        <h1 class="mb-8 text-white sm:text-5xl text-3xl title-bold">{{ post.title }}</h1>
        <p class="text-white">
          <the-time :date="post.date" class="block sm:inline-block sm:text-2xl"></the-time>
          <span class="hidden sm:inline-block">·</span>
          <span class="block sm:inline-block">{{ cupsWhileReading }}️ {{ formattedMinutesToRead }} read</span>
        </p>
        <p v-if="mentions" class="text-white">
          <i
            >Indieweb! This article has been mentioned: <code>{{ mentions }} {{ mentions > 1 ? 'times' : 'time' }}</code
            >!</i
          >
        </p>
      </div>
    </header>
    <div v-if="post" class="w-3/4 sm:w-1/2 mx-auto py-10 sm:text-lg">
      <ContentRenderer :value="post" class="py-10" />
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Post } from '~/types'

const TheTime = defineAsyncComponent(() => import('~/components/base-texts/the-time.vue'))

definePageMeta({
  layout: 'post',
})

const publicConfig = useRuntimeConfig().public
const siteUrl = publicConfig.APP_URL
const siteName = publicConfig.APP_NAME

const route = useRoute()
const { data } = await useAsyncData('post', () =>
  queryContent('blog')
    .where({ _path: { $match: route.path } })
    .findOne()
)
const post = computed(() => data.value as Post)

const formattedMinutesToRead = computed(() => {
  const nativePluralRules = new Intl.PluralRules()
  const options = new Map([
    ['zero', 'zero time to'],
    ['one', 'min'],
    ['two', 'mins'],
    ['few', 'mins'],
    ['many', 'mins'],
    ['other', 'mins'],
  ])
  const formatTime = (minutes: number) => {
    const rule = nativePluralRules.select(minutes)
    const suffix = options.get(rule)
    return `${minutes} ${suffix}`
  }
  return formatTime(Math.floor(900000 / 150) || 1)
})
const minutesToRead = computed(() => 1)
const cupsWhileReading = computed(() => {
  return (minutesToRead.value && new Array(Math.floor(minutesToRead.value / 3)).fill('☕️').join('')) || '🌸'
})

const mentions = /* useWebmentionStore().webmentions */ 1

useContentHead(post)
</script>

<style lang="postcss" scoped>
.bg-image {
  @apply z-1 relative;
  &:after {
    content: '';
    @apply inset-0 absolute bg-black;
    opacity: 0.75;
    z-index: -1;
  }
}
</style>
