<template>
  <base-texts-the-title>
    <h1 class="text-3xl">Open Source Software Projects</h1>
    <template #subtitle>
      <p>
        Since I started Graficos.NET, I have been committed to open source. Here you can find a non-thorough list of my
        open source projects, including the source code of this website. If you want to contribute, please do so!
      </p>
    </template>
  </base-texts-the-title>
  <section>
    <ul>
      <li v-for="project in projects" :key="project.path" class="mb-5">
        <NuxtLink :to="project.path" class="text-xl font-semibold">
          {{ project.title }}
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>

<script lang="ts" setup>
useHead({
  title: 'Open Source',
  meta: [
    {
      name: 'description',
      content: 'Open Source projects of Graficos.NET.',
    },
  ],
})

const { data: projects } = await useAsyncData('openSourceList', () =>
  queryCollection('openSource').select('path', 'title').all()
)
</script>
