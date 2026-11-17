<template>
  <div class="post-container pb-16">
    <BaseTextsTheTitle class="mb-12">
      <h1 class="text-2xl sm:text-3xl">Collections</h1>
      <template #subtitle>
        <p>
          Things I discover on the web and want to keep: fonts, web projects, movements, websites, animation, 3D, and
          games.
        </p>
      </template>
    </BaseTextsTheTitle>

    <nav aria-label="Collection categories" class="mb-10 overflow-x-auto">
      <ul class="m-0 flex min-w-max list-none gap-1 border-b border-gray-light p-0 dark:border-gray-darkest">
        <li v-for="tab in tabs" :key="tab.label">
          <NuxtLink
            :to="tab.to"
            class="collection-tab"
            :aria-current="activeCategory === tab.slug ? 'page' : undefined"
          >
            {{ tab.label }}
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <Transition name="collections-fade" mode="out-in">
      <div :key="activeCategory ?? 'all'">
        <section v-if="activeCategory">
          <header class="mb-6">
            <h2 class="text-xl font-title sm:text-2xl">{{ activeLabel }}</h2>
            <p v-if="activeSubline" class="mt-2 text-sm text-gray-dark dark:text-gray-light">
              {{ activeSubline }}
            </p>
          </header>
          <CollectionsCollectionGrid v-if="filteredItems.length" :items="filteredItems" />
          <p v-else class="text-gray-dark dark:text-gray-light">I still need to add something here... 🫶🏽😄</p>
        </section>

        <template v-else>
          <section
            v-for="(group, index) in groups"
            :key="group.slug"
            :class="index > 0 ? 'border-t border-gray-light pt-12 pb-12 dark:border-gray-darkest' : 'pb-12'"
          >
            <header class="mb-6">
              <h2 class="text-xl font-title sm:text-2xl">{{ group.label }}</h2>
              <p v-if="group.subline" class="mt-2 text-gray-darker dark:text-gray-lightest">
                {{ group.subline }}
              </p>
            </header>
            <CollectionsCollectionGrid :items="group.items" />
          </section>
        </template>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import {
  collectionCategories,
  collectionCategoryLabel,
  collectionCategorySubline,
  groupCollectionsByCategory,
  isCollectionCategory,
} from '~/config/collections'

definePageMeta({
  key: 'collections',
  validate: (route) => {
    const category = route.params.category
    return !category || (typeof category === 'string' && isCollectionCategory(category))
  },
})

const route = useRoute()

const tabs = [
  { slug: null, label: 'All', to: '/collections' },
  ...collectionCategories.map(({ slug, label }) => ({ slug, label, to: `/collections/${slug}` })),
]

const activeCategory = computed(() => {
  const category = route.params.category
  return typeof category === 'string' && isCollectionCategory(category) ? category : null
})

const activeLabel = computed(() => (activeCategory.value ? collectionCategoryLabel(activeCategory.value) : null))
const activeSubline = computed(() =>
  activeCategory.value ? collectionCategorySubline(activeCategory.value) : undefined
)

const title = computed(() => (activeLabel.value ? `${activeLabel.value} - Collections` : 'Collections'))
const description = computed(() =>
  activeLabel.value
    ? `A collection of ${activeLabel.value.toLowerCase()} discovered by Paul Melero.`
    : 'A collection of fonts, web projects, movements, websites, animation, 3D and web games discovered by Paul Melero.'
)

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
})

const { collections } = useCollections()

const filteredItems = computed(() => {
  if (!activeCategory.value) return []

  return (collections.value ?? []).filter((item) => item.category === activeCategory.value)
})

const groups = computed(() => groupCollectionsByCategory(collections.value ?? []))
</script>

<style scoped>
.collection-tab {
  @apply relative inline-flex shrink-0 items-center px-3 py-3 font-ibm text-sm text-gray-dark no-underline transition-colors dark:text-gray-light;
}

.collection-tab:hover,
.collection-tab[aria-current='page'] {
  @apply text-accent dark:text-actionDark;
}

.collection-tab[aria-current='page']::after {
  content: '';
  @apply absolute inset-x-0 -bottom-px;
  border-bottom: 3px solid currentColor;
}

@media (prefers-reduced-motion: no-preference) {
  .collections-fade-enter-active,
  .collections-fade-leave-active {
    transition:
      opacity 150ms ease,
      transform 150ms ease;
  }

  .collections-fade-enter-from {
    opacity: 0;
    transform: translateY(8px);
  }

  .collections-fade-leave-to {
    opacity: 0;
    transform: translateY(-8px);
  }
}
</style>
