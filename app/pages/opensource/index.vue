<template>
  <article class="post-container">
    <base-texts-the-title class="mb-24">
      <h1 class="text-3xl">Open Source Software Projects</h1>
      <template #subtitle>
        <p>
          Since I started Graficos.NET, I have been committed to open source. Here you can find a non-thorough list of
          my open source projects, including the source code of this website.
        </p>
        <p>If you want to contribute, please do so!</p>
      </template>
    </base-texts-the-title>
    <section>
      <ol class="pl-5 list-decimal">
        <li
          v-for="project in projects"
          :key="project.path"
          class="mb-5 first:border-b first:border-gray-light first:pb-5"
        >
          <NuxtLink :to="project.path" class="text-xl font-semibold">
            {{ project.title }}
          </NuxtLink>
        </li>
      </ol>
    </section>
  </article>
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

const { data: projects } = await useAsyncData('openSourceList', async () => {
  const list = await queryCollection('openSource')
    .select('path', 'title', 'yearCreated')
    .order('yearCreated', 'DESC')
    .all()

  // Always put `graficost-net` at the top of the list
  const graficosNet = list.find((project) => project.path === '/opensource/graficos-net')
  if (graficosNet) {
    list.splice(list.indexOf(graficosNet), 1)
    list.unshift(graficosNet)
  }
  return list
})
</script>
