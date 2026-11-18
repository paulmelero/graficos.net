<template>
  <div class="post-container pb-16">
    <BaseTextsTheTitle class="mb-12">
      <h1 class="text-2xl sm:text-3xl">Collections</h1>
      <template #subtitle>
        <p>
          Things I discover on the web and want to share and keep: fonts, web projects, movements, websites, animation,
          3D, games, etc.
        </p>
      </template>
    </BaseTextsTheTitle>

    <nav aria-label="Collection categories" class="mb-10 overflow-x-auto">
      <ul class="m-0 flex min-w-max list-none gap-1 border-b border-gray-light p-0 dark:border-gray-darkest">
        <li v-for="tab in tabs" :key="tab.label">
          <a
            :href="tab.to"
            class="collection-tab"
            :aria-current="activeCategory === tab.slug ? 'page' : undefined"
            @click="navigateTab($event, tab.to)"
          >
            {{ tab.label }}
          </a>
        </li>
      </ul>
    </nav>

    <div>
      <section v-if="activeCategory">
        <header class="mb-6">
          <h2 class="text-xl font-title sm:text-2xl">{{ activeLabel }}</h2>
          <p v-if="activeSubline" class="mt-2 text-gray-darker dark:text-gray-lightest">
            {{ activeSubline }}
          </p>
        </header>
        <CollectionsCollectionGrid v-if="filteredItems.length" :items="filteredItems" minimalInfo />
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
          <CollectionsCollectionGrid :items="group.items" minimalInfo />
        </section>
      </template>
    </div>
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
const router = useRouter()

const navigateTab = async (event: MouseEvent, to: string) => {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return
  }

  event.preventDefault()

  if (route.path === to) return

  if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    await router.push(to)
    return
  }

  const transition = document.startViewTransition(async () => {
    await router.push(to)
    await nextTick()
  })

  await transition.finished.catch(() => {})
}

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
</style>

<style>
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 220ms;
  animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
}

@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation: none !important;
  }
}
</style>
