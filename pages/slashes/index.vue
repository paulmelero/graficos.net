<template>
  <base-texts-the-title>
    <h1 class="text-3xl">Slash Pages</h1>
    <template #subtitle>
      <p>
        Slash pages list of Graficos.NET. See
        <BaseTextsExternalLink href="https://slashpages.net/">https://slashpages.net/</BaseTextsExternalLink>.
      </p>
    </template>
  </base-texts-the-title>
  <section class="sm:flex sm:justify-between">
    <ContentList path="/slashes" v-slot="{ list }">
      <li v-for="article in list" :key="article._path">
        <NuxtLink :to="article._path">
          <p class="text-xl font-semibold inline">{{ article.title }}</p>
        </NuxtLink>
      </li>
    </ContentList>
  </section>
</template>

<script setup lang="ts">
useHead({
  title: 'Slashes',
  meta: [
    {
      name: 'description',
      content: 'Slash pages list of Graficos.NET.',
    },
  ],
})
</script>
