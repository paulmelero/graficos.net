<template>
  <div class="absolute container px-10 lg:pl-0 inset-x-0 top-[calc(105svh+96px)] h-[calc(95svh-96px*2)] z-20">
    <div class="grid lg:grid-cols-3 container py-4">
      <BaseTextsTheTitle class="mb-16 lg:col-span-2 lg:col-start-2">
        <h2 class="text-2xl sm:text-3xl">Recent projects</h2>
        <template #subtitle>
          <p>These are some of my recent projects.</p>
        </template>
      </BaseTextsTheTitle>
    </div>
    <div class="grid lg:grid-cols-3 container pb-4 mx-auto">
      <div class="lg:col-span-2 lg:col-start-2 grid gap-4 lg:grid-cols-3">
        <NuxtLink
          :to="project.link"
          v-for="(project, i) in recentProjects"
          :key="project.link"
          class="card no-underline"
        >
          <h3 class="text-2xl font-title mb-2">
            {{ project.title }}
          </h3>
          <p class="text-sm text-gray-dark dark:text-gray-light">{{ project.description }}</p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const recentProjects = Object.freeze([
  {
    title: 'FlipTheCoin.app',
    description:
      'The only 3D coin flip simulator online with a real physics engine and a personal blog on probability, statistics, math, and more.',
    link: '/opensource/flip-the-coin-app',
  },
  {
    title: 'Nuxt comments',
    description:
      'Embeddable, unstyled comments system for Nuxt 4, backed by Cloudflare D1 and authenticated via @nuxtjs/better-auth',
    link: '/opensource/nuxt-comments',
  },
  {
    title: '[Safe]Reader',
    description: 'A privacy-focused reading app for online media articles.',
    link: '/opensource/safe-reader',
  },
])
</script>
