<template>
  <div class="flex flex-col content-around min-h-screen bg-container relative">
    <section>
      <div class="flex flex-col items-center py-4">
        <h1 v-if="error?.statusCode === 404" class="text-4xl mb-3 text-secondary">Page not found</h1>
        <h1 v-else class="text-4xl mb-3 text-secondary">Error {{ error?.statusCode }} found...</h1>
        <nuxt-link to="/" class="text-primary">Go to home</nuxt-link>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError,
})

console.log(props.error)

const handleError = () => clearError({ redirect: '/' })
</script>
