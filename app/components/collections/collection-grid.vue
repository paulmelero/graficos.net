<template>
  <div class="grid grid-cols-[repeat(auto-fill,minmax(min(100%,16rem),1fr))] gap-4">
    <CollectionsCollectionCard v-for="item in items" :key="item.path" :item="item" />
  </div>
</template>

<script setup lang="ts">
import type { CollectionInList } from '~/types'

defineProps<{ items: CollectionInList[] }>()
</script>
