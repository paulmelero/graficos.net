<template>
  <article class="article-post">
    <header
      v-if="post && post.thumbnail"
      class="py-16 bg-image bg-center bg-cover min-h-50 flex-col flex content-center"
      :style="`background-image: url( ${post.thumbnail} )`"
    >
      <div class="w-3/4 xl:w-1/2 my-auto mx-auto text-white max-w-3xl">
        <h1 class="mb-8 sm:text-5xl text-3xl title-bold">{{ post.title }}</h1>
        <p class="">
          <base-texts-the-time :date="post.date" class="block sm:inline-block" />
          <span class="hidden sm:inline-block sm:mx-2">·</span>
          <span class="block sm:inline-block">{{ emojisWhileReading }}️ {{ formattedMinutesToRead }} read</span>
        </p>
        <p v-if="mentions" class="">
          <i
            >Indieweb! This article has been mentioned: <em>{{ mentions }} {{ mentions > 1 ? 'times' : 'time' }}</em
            >!</i
          >
        </p>
      </div>
    </header>
    <div v-if="post" class="w-3/4 xl:w-1/2 mx-auto py-10 sm:text-lg max-w-3xl">
      <ContentRenderer :value="post" class="py-10" />
    </div>
  </article>
</template>

<script lang="ts" setup>
import type { Post } from '~/types'

definePageMeta({
  layout: 'post',
})

const publicConfig = useRuntimeConfig().public
const siteName = publicConfig.APP_NAME

const route = useRoute()

// Post
const { data: post } = await useAsyncData(`post-${route.path}`, async () => {
  return queryCollection('blog')
    .where('path', '=', route.path)
    .select('title', 'lang', 'summary', 'tags', 'date', 'thumbnail', 'body', 'description')
    .first()
})

// Head - SEO
post.value &&
  useSeoMeta({
    title: post.value.title,
    ogTitle: post.value.title,
    description: post.value.description,
    ogImage: post.value.thumbnail,
    ogLocale: post.value.lang,
    ogSiteName: siteName,
    twitterTitle: post.value.title,
    twitterImage: post.value.thumbnail,
    twitterCreator: `@${publicConfig.TWITTER_USERNAME}`,
  })

// Minutes to read
const { formattedMinutesToRead, emojisWhileReading } = useMinutesToRead({ post })

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
