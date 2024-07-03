<template>
  <article class="article-post relative z-1">
    <header
      v-if="post && post.thumbnail"
      class="py-16 bg-image bg-center bg-cover min-h-50 flex-col flex content-center"
      :style="`background-image: url( ${post.thumbnail} )`"
    >
      <div class="w-3/4 sm:w-1/2 my-auto mx-auto text-white">
        <h1 class="mb-8 sm:text-5xl text-3xl title-bold">{{ post.title }}</h1>
        <p class="">
          <base-texts-the-time :date="post.date" class="block sm:inline-block" />
          <span class="hidden sm:inline-block sm:mx-2">·</span>
          <span class="block sm:inline-block">{{ cupsWhileReading }}️ {{ formattedMinutesToRead }} read</span>
        </p>
        <p v-if="mentions" class="">
          <i
            >Indieweb! This article has been mentioned: <em>{{ mentions }} {{ mentions > 1 ? 'times' : 'time' }}</em
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

definePageMeta({
  layout: 'post',
})

const publicConfig = useRuntimeConfig().public
const siteName = publicConfig.APP_NAME

const route = useRoute()

// Post
const { data } = await useAsyncData('post', () =>
  queryContent('blog')
    .where({ _path: { $match: route.path } })
    .findOne()
)
const post = computed(() => data.value as Post)

// Head - SEO
useContentHead(post)

// Minutes to read
const calculateMinutes = (textLength: number) => {
  return Math.floor(textLength / 7 / 60)
}

const minutesToRead = ref(1)
let lengthOfPost = ref(0)

const calculateLengthOfPost = (postBodyNode: Post['body']) => {
  if (postBodyNode && postBodyNode.children) {
    postBodyNode.children.forEach((child: any) => {
      if (child.type === 'text') {
        lengthOfPost.value += child.value.length
      }
      calculateLengthOfPost(child)
    })
  }
}

watchEffect(() => {
  if (!post.value || !post.value.body) return
  calculateLengthOfPost(post.value.body)
  minutesToRead.value = calculateMinutes(lengthOfPost.value)
})

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
  return formatTime(minutesToRead.value || 1)
})

const cupsWhileReading = computed(() => {
  return (minutesToRead.value && new Array(Math.floor(minutesToRead.value / 4)).fill('☕️').join('')) || '🌸'
})

// Webmentions
const { data: mentions } = useAsyncData(
  'mentions',
  () =>
    $fetch(
      `https://webmention.io/api/mentions.jf2?target=https://${siteName + route.fullPath}&token=${
        publicConfig.WEBMENTIONS_TOKEN
      }&sort-by=updated&&wm-property[]=in-reply-to&wm-property[]=like-of&wm-property[]=repost-of&wm-property[]=mention-of`
    ),
  {
    transform: (data: any) => data.children.length,
  }
)
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
