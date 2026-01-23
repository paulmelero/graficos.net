<template>
  <div class="absolute inset-x-0 top-[calc(105vh+96px)] h-[calc(95vh-96px*2)] z-20">
    <div class="container py-4">
      <h2 class="ibm text-3xl ibm font-thin">More to come!</h2>
    </div>

    <!-- TODO! -->
    <!-- <div class="relative h-full">
      <div
        class="absolute inset-0 grid gap-4 md:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4 md:p-6 lg:p-8 overflow-y-auto h-full"
      >
        <NuxtLink
          v-for="project in recentProjects"
          :key="project.title"
          :to="project.link"
          class="group block rounded-lg overflow-hidden border border-gray-light dark:border-gray-dark hover:shadow-lg transition-shadow duration-300 ease-in-out"
        >
          <NuxtImg
            :src="project.image"
            :alt="`Screenshot of ${project.title} project`"
            class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
          />
          <div class="p-4 bg-white dark:bg-gray-darker">
            <h3 class="text-lg font-semibold mb-2 text-gray-darker dark:text-gray-lightest">{{ project.title }}</h3>
            <p class="text-sm text-gray-dark dark:text-gray-light">{{ project.description }}</p>
          </div>
        </NuxtLink>
      </div>
      </div> -->
  </div>
</template>

<script lang="ts" setup>
const recentProjects = [
  {
    title: 'Project Alpha',
    description: 'A web application for managing tasks efficiently.',
    image: '/images/projects/project-alpha.webp',
    link: '/projects/alpha',
  },
  {
    title: 'Beta Blog',
    description: 'A modern blogging platform with rich features.',
    image: '/images/projects/beta-blog.webp',
    link: '/projects/beta-blog',
  },
  {
    title: 'Gamma E-commerce',
    description: 'An e-commerce site with seamless shopping experience.',
    image: '/images/projects/gamma-ecommerce.webp',
    link: '/projects/gamma-ecommerce',
  },
  {
    title: 'Delta Dashboard',
    description: 'A dashboard for visualizing data in real-time.',
    image: '/images/projects/delta-dashboard.webp',
    link: '/projects/delta-dashboard',
  },
]
</script>
