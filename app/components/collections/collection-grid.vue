<template>
  <div class="grid grid-cols-[repeat(auto-fill,minmax(min(100%,16rem),1fr))] gap-4">
    <CollectionsCollectionCard
      v-for="item in items"
      :key="item.path"
      :item="item"
      :full-link="false"
      :minimal-info="minimalInfo"
    />
  </div>
</template>

<script setup lang="ts">
import type { CollectionInList } from '~/types'

defineProps<{ items: CollectionInList[]; minimalInfo?: boolean }>()
</script>
