<template>
  <img :src="src" :alt="alt ?? ''" loading="lazy" />
</template>

<script setup lang="ts">
defineProps<{
  src: string
  alt?: string
}>()
</script>
