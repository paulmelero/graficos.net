<template>
  <article class="article-post">
    <header
      v-if="post && post.thumbnail"
      class="py-16 bg-image bg-center bg-cover min-h-[50vh] flex-col flex content-center"
      :style="`background-image: url( ${post.thumbnail} )`"
    >
      <div class="w-3/4 xl:w-1/2 my-auto mx-auto text-white max-w-3xl">
        <h1 class="mb-8 sm:text-5xl text-3xl font-title">{{ post.title }}</h1>
        <p>
          <BlogArticleDate :date="post.date" :modifiedDate="post.modifiedDate" />
          <span class="hidden sm:inline-block sm:mx-2">·</span>
          <span class="block sm:inline-block font-ibm">{{ emojisWhileReading }}️ {{ formattedMinutesToRead }} read</span>
        </p>
        <BlogWebMentions :lang="post.lang" />
      </div>
    </header>
    <div v-if="post" class="post-container">
      <ContentRenderer :value="post" class="py-10" />
    </div>
  </article>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'post',
})

defineRouteRules({
  prerender: true,
})

const route = useRoute()

// Post
const { data: post } = await useAsyncData(
  () => {
    return queryCollection('blog')
      .where('path', '=', route.path)
      .select('title', 'lang', 'summary', 'tags', 'date', 'thumbnail', 'body', 'description', 'modifiedDate')
      .first()
  },
  {
    getCachedData(key, nuxtApp) {
      return nuxtApp.isHydrating ? nuxtApp.payload.data[key] : nuxtApp.static.data[key]
    },
  }
)

const { APP_NAME, APP_URL } = useRuntimeConfig().public
const ogUrl = new URL(route.fullPath, APP_URL).href
const socialImageUrl = post.value?.thumbnail
  ? new URL(post.value.thumbnail.replace(/\.avif(?=($|[?#]))/i, '.png'), APP_URL).href
  : undefined

// Head - SEO
useSeoMeta({
  title: post.value?.title,
  ogTitle: post.value?.title,
  ogUrl,
  ogType: 'article',
  description: post.value?.description,
  ogDescription: post.value?.description,
  ...(post.value?.date && { publishedTime: post.value.date }),
  ...(post.value?.modifiedDate && { modifiedTime: post.value.modifiedDate }),
  ogImage: socialImageUrl,
  ogLocale: post.value?.lang,
  ogSiteName: APP_NAME,
  twitterTitle: post.value?.title,
  twitterDescription: post.value?.description,
  twitterImage: socialImageUrl,
  twitterCard: 'summary_large_image',
})

useCanonicalUrl(route.fullPath)

useHead({
  // preload LCP iamge with fetchpriority="high"
  link: [
    {
      rel: 'preload',
      href: post.value?.thumbnail,
      as: 'image',
      fetchpriority: 'high',
    },
  ],
})

const { formattedMinutesToRead, emojisWhileReading } = useMinutesToRead({ post })
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
