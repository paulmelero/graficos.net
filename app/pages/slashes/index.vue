<template>
  <article class="post-container">
    <base-texts-the-title>
      <h1 class="text-3xl">Slash Pages</h1>
      <template #subtitle>
        <p>
          Slash pages list of Graficos.NET. See
          <BaseTextsExternalLink href="https://slashpages.net/">https://slashpages.net/</BaseTextsExternalLink>.
        </p>
      </template>
    </base-texts-the-title>
    <section>
      <ul class="list-disc pl-5">
        <li v-for="article in list" :key="article.path" class="mb-5">
          <NuxtLink :to="article.path" class="text-xl font-semibold">
            {{ article.title }}
          </NuxtLink>
        </li>
      </ul>
    </section>
  </article>
</template>

<script lang="ts" setup>
useHead({
  title: 'Slashes',
  meta: [
    {
      name: 'description',
      content: 'Slash pages list of Graficos.NET.',
    },
  ],
})

const { data: list } = await useAsyncData('slashes', () => queryCollection('slashes').select('path', 'title').all())
</script>
