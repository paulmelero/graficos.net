<template>
  <span class="inline-flex flex-wrap items-center gap-1 text-sm">
    <nuxt-link v-if="name" :to="`/blog/tag/${name.toLowerCase()}`" class="no-underline hover:underline">
      {{ name }} </nuxt-link
    >&nbsp;<span class="text-gray-darker dark:text-gray-light font-bold leading-tight text-sm">{{ size }}</span>
  </span>
</template>

<script lang="ts" setup>
const sizesTable = {
  1: 'text-base',
  2: 'text-xl',
  3: 'text-2xl',
}

defineProps<{
  name: string
  size: number
}>()
</script>
