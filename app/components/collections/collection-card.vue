<template>
  <article
    class="card group relative flex h-full flex-col focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent dark:focus-within:outline-actionDark"
  >
    <header class="mb-1 flex items-start justify-between gap-2">
      <p class="font-ibm text-xs tracking-wider text-accent uppercase dark:text-actionDark">
        {{ categoryLabel }}
      </p>
      <GIcon
        name="material-symbols-light:open-in-new"
        class="shrink-0 text-base text-gray-dark dark:text-gray-light"
        aria-hidden="true"
      />
    </header>
    <h3 class="mb-2 text-2xl font-title">
      <a
        :href="item.link"
        target="_blank"
        rel="noopener noreferrer"
        class="card-link no-underline group-hover:underline focus-visible:outline-none"
      >
        {{ item.title }}
        <span class="sr-only">(opens in a new tab)</span>
      </a>
    </h3>
    <p class="mb-4 text-sm text-gray-dark dark:text-gray-light">{{ item.description }}</p>
    <footer class="mt-auto pt-2 font-ibm text-xs text-gray-dark dark:text-gray-light">
      <BaseTextsTheTime :date="item.createdAt" />
    </footer>
  </article>
</template>

<script setup lang="ts">
import type { CollectionInList } from '~/types'
import { collectionCategoryLabel } from '../../config/collections'

const props = defineProps<{ item: CollectionInList }>()

const categoryLabel = computed(() => collectionCategoryLabel(props.item.category))
</script>

<style scoped>
.card-link::after {
  content: '';
  position: absolute;
  inset: 0;
}
</style>
