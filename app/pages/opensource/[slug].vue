<template>
  <section class="post-container mx-auto py-10">
    <BaseTextsTheTitle class="mb-24" v-if="page">
      <h1 class="text-3xl">{{ page.title }}</h1>
    </BaseTextsTheTitle>
    <table v-if="page" class="mt-4 mb-6 border-collapse w-full table-fixed">
      <tbody>
        <tr>
          <td class="pr-2">Created:</td>
          <td>{{ page.yearCreated }}</td>
        </tr>
        <tr v-if="page.url">
          <td class="pr-2">Website:</td>
          <td>
            <a :href="page.url" target="_blank" rel="noopener noreferrer">{{ page.url }}</a>
          </td>
        </tr>
        <tr v-if="page.repositoryUrl">
          <td class="pr-2">Repository:</td>
          <td>
            <a :href="page.repositoryUrl" target="_blank" rel="noopener noreferrer">{{ page.repositoryUrl }}</a>
          </td>
        </tr>
      </tbody>
    </table>
    <article class="article-post">
      <div v-if="page" class="sm:text-lg">
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

const { data: page } = await useAsyncData(`opensource-${route.path}`, () =>
  queryCollection('openSource').where('path', '=', route.path).first()
)

useSeoMeta({
  title: page.value?.title,
  ogTitle: page.value?.title,
  description: page.value?.description,
  ogSiteName: 'Graficos.NET',
  twitterTitle: page.value?.title,
  twitterCreator: '@paulmelero',
})
</script>

<style lang="postcss" scoped>
table,
th,
td {
  @apply border border-gray-dark dark:border-gray-light;
}

table td {
  @apply px-2 py-2 overflow-scroll;
}

table td:first-child {
  @apply font-semibold w-auto md:max-w-[30%];
}
</style>
