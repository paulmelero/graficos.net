<template>
  <section v-if="drop" class="post-container mx-auto py-10">
    <BaseTextsTheTitle class="mb-16">
      <h1 class="text-2xl sm:text-3xl">{{ drop.title }}</h1>
      <template #subtitle>
        <p>{{ drop.summary }}</p>
      </template>
    </BaseTextsTheTitle>

    <p class="font-ibm text-sm text-gray-dark dark:text-gray-light">
      <BlogArticleDate :date="drop.date" />
    </p>

    <article class="article-post">
      <div class="article-post font-ibm">
        <ContentRenderer :value="drop" class="py-10" />
      </div>

      <NewsletterSignup variant="post" />

      <p class="mt-8 font-ibm">
        <NuxtLink to="/newsletter/drops">All Drops</NuxtLink>
      </p>
    </article>
  </section>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'post',
})

const route = useRoute()

const { data: drop } = await useAsyncData(
  () => {
    return queryCollection('newsletter')
      .where('path', '=', route.path)
      .select('title', 'summary', 'date', 'draft', 'body')
      .first()
  },
  {
    getCachedData(key, nuxtApp) {
      return nuxtApp.isHydrating ? nuxtApp.payload.data[key] : nuxtApp.static.data[key]
    },
  }
)

if (!drop.value || drop.value.draft) {
  throw createError({ statusCode: 404, statusMessage: 'Drop not found' })
}

const dropData = drop.value
const { APP_NAME, APP_URL } = useRuntimeConfig().public
const ogUrl = new URL(route.fullPath, APP_URL).href

useSeoMeta({
  title: dropData.title,
  ogTitle: dropData.title,
  ogUrl,
  ogType: 'article',
  description: dropData.summary,
  ogDescription: dropData.summary,
  ...(dropData.date && { publishedTime: dropData.date }),
  ogSiteName: APP_NAME,
  twitterTitle: dropData.title,
  twitterDescription: dropData.summary,
  twitterCard: 'summary',
})

useCanonicalUrl(route.fullPath)
</script>
