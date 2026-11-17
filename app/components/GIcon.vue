<template>
  <Icon :icon="name" :width="size" :height="size" :ssr="true" />
</template>

<script setup lang="ts">
import { Icon, addCollection } from '@iconify/vue'

import { iconifyCollections } from '../config/iconify'

// Register synchronously so SSR and hydration render identical icon markup.
for (const collection of iconifyCollections) addCollection(collection)

defineProps<{
  name: string
  size?: number
}>()
</script>
