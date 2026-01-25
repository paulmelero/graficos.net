<template>
  <section class="post-container mx-auto">
    <base-texts-the-title class="mb-24" v-if="page">
      <h1 class="text-3xl">{{ page.title }}</h1>
    </base-texts-the-title>
    <article class="article-post">
      <div v-if="page">
        <ContentRenderer :value="page" class="py-10" />
      </div>
    </article>
  </section>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'post',
})

const route = useRoute()

// Page
const { data: page } = await useAsyncData(`slash-${route.path}`, () =>
  queryCollection('slashes').where('path', '=', route.path).first()
)

// Head - SEO
useSeoMeta({
  title: page.value?.title,
  ogTitle: page.value?.title,
  description: page.value?.description,
  ogSiteName: 'Graficos.NET',
  twitterTitle: page.value?.title,
  twitterCreator: '@paulmelero',
})
</script>
