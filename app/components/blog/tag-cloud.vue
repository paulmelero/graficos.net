<template>
  <div class="card">
    <h3 class="font-ibm dark:font-thin mb-4">{{ sectionTitle }}</h3>
    <div v-if="Object.keys(tags).length">
      <ul class="list-reset flex gap-2 flex-wrap mb-4">
        <li v-for="(tag, i) in visibleTags" :key="i">
          <blog-tag-media :name="tag" :size="tags[tag] || 1" class="capitalize" />
        </li>
      </ul>

      <div v-if="hasMoreTags" class="overflow-hidden transition-all duration-300 ease-in-out" :style="expandedStyle">
        <ul class="list-reset flex gap-2 flex-wrap pb-4">
          <li v-for="(tag, i) in hiddenTags" :key="i">
            <blog-tag-media :name="tag" :size="tags[tag] || 1" class="capitalize" />
          </li>
        </ul>
      </div>

      <button
        v-if="hasMoreTags"
        class="text-sm font-ibm dark:font-thin text-gray-dark dark:text-gray-light hover:underline flex items-center gap-1"
        @click="isExpanded = !isExpanded"
      >
        {{ isExpanded ? 'Show less' : `Show ${hiddenTags.length} more tags` }}
        <span class="transition-transform duration-300" :class="{ 'rotate-180': isExpanded }">↓</span>
      </button>
    </div>
    <p v-else class="text-sm text-gray-500">No tags found</p>
    <p v-if="!shouldHide" class="text-sm font-ibm dark:font-thin">
      Go back to <nuxt-link to="/blog">the blog</nuxt-link> to see all posts.
    </p>
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    tags: Record<string, number>
    sectionTitle?: string
    shouldHide?: boolean
  }>(),
  {
    sectionTitle: 'Tags',
    shouldHide: false,
  }
)

const sortedTags = computed(() => {
  const tags = props.tags || {}
  return Object.keys(tags).sort((a, b) => (tags[b] || 0) - (tags[a] || 0))
})

const isExpanded = ref(false)
const visibleTags = computed(() => sortedTags.value.slice(0, 10))
const hiddenTags = computed(() => sortedTags.value.slice(10))
const hasMoreTags = computed(() => hiddenTags.value.length > 0)

const expandedStyle = computed(() => ({
  maxHeight: isExpanded.value ? '1000px' : '0px',
  opacity: isExpanded.value ? '1' : '0',
}))
</script>
