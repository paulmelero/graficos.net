<template>
  <div class="absolute inset-x-0 top-[calc(105vh+96px)] h-[calc(95vh-96px*2)] z-20">
    <div class="container py-4">
      <h2 class="font-ibm text-3xl font-thin">Recent projects</h2>
      <p>These are some of my recent projects.</p>
    </div>
    <div class="grid lg:grid-cols-3 container pb-4 mx-auto">
      <div class="lg:col-span-2 lg:col-start-2 grid gap-4 lg:grid-cols-3">
        <NuxtLink :to="project.link" v-for="project in recentProjects" :key="project.link" class="card no-underline">
          <h3 class="text-lg font-ibm font-thin mb-2 text-gray-darker dark:text-gray-lightest">{{ project.title }}</h3>
          <p class="text-sm text-gray-dark dark:text-gray-light">{{ project.description }}</p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const recentProjects = Object.freeze([
  {
    title: 'Odds & End—point—s',
    description: 'A web application to query odds of various events.',
    link: '/opensource/odds-and-end-points',
  },
  // {
  // title: 'FlipTheCoin.app',
  // description: 'A toy project to simulate coin flips with a physics engine in the browser.',
  // link: '/opensource/flip-the-coin-app',
  // },
  {
    title: 'Safe reader',
    description: 'A privacy-focused reading app for online media articles.',
    link: '/opensource/safe-reader',
  },
  {
    title: 'Churn Explorer',
    description: 'A VS Code extension to analyze code churn data.',
    link: '/opensource/churnlens-extension',
  },
])
</script>
