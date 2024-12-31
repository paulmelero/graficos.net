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
  <section>
    <ContentList v-slot="{ list }" path="/slashes">
      <li v-for="article in list" :key="article._path" class="mb-5">
        <NuxtLink :to="article._path" class="text-xl font-semibold">
          {{ article.title }}
        </NuxtLink>
      </li>
    </ContentList>
  </section>
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
</script>
