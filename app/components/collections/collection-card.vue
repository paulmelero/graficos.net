<template>
  <article
    class="card group relative flex h-full flex-col focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent dark:focus-within:outline-actionDark"
  >
    <header v-if="!minimalInfo" class="mb-1 flex items-start justify-between gap-2">
      <p class="font-ibm text-xs tracking-wider text-accent uppercase dark:text-actionDark">
        {{ categoryLabel }}
      </p>
      <GIcon
        name="material-symbols-light:open-in-new"
        :size="16"
        class="shrink-0 text-base text-gray-dark dark:text-gray-light"
        aria-hidden="true"
      />
    </header>
    <h3 class="mb-2 flex items-start gap-2 text-2xl font-title">
      <img
        v-if="faviconUrl && showFavicon"
        :src="faviconUrl"
        alt=""
        width="20"
        height="20"
        loading="lazy"
        decoding="async"
        referrerpolicy="no-referrer"
        class="mt-1 h-5 w-5 shrink-0 rounded-sm"
        @error="showFavicon = false"
      />
      <a
        :href="item.link"
        target="_blank"
        rel="noopener noreferrer"
        class="no-underline [text-box-trim:trim-both]"
        :class="{
          'card-link group-hover:underline focus-visible:outline-none': fullLink,
        }"
      >
        {{ item.title }}
        <span class="sr-only">(opens in a new tab)</span>
      </a>
    </h3>
    <MDC :value="item.description" class="collection-description mb-4 text-sm text-gray-dark dark:text-gray-light" />
    <footer class="mt-auto pt-2 font-ibm text-xs text-gray-dark dark:text-gray-light">
      <BaseTextsTheTime :date="item.createdAt" />
    </footer>
  </article>
</template>

<script setup lang="ts">
import type { CollectionInList } from '~/types'
import { collectionCategoryLabel } from '../../config/collections'

const props = defineProps<{ item: CollectionInList; fullLink?: boolean; minimalInfo?: boolean }>()

const categoryLabel = computed(() => collectionCategoryLabel(props.item.category))
const showFavicon = ref(true)
const faviconUrl = computed(() => {
  try {
    return `https://icons.duckduckgo.com/ip3/${new URL(props.item.link).hostname}.ico`
  } catch {
    return null
  }
})
</script>

<style scoped>
.card-link::after {
  content: '';
  position: absolute;
  inset: 0;
}

.collection-description :deep(p:last-child) {
  margin-bottom: 0;
}

.collection-description :deep(a) {
  position: relative;
  z-index: 1;
}
</style>
