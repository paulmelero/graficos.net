<template>
  <div class="card">
    <h3 class="font-ibm dark:font-thin mb-4">{{ sectionTitle }}</h3>
    <ul v-if="Object.keys(tags).length" class="list-reset flex gap-2 flex-wrap">
      <li v-for="(tag, i) in Object.keys(tags)" :key="i">
        <blog-tag-media :name="tag" :size="tags[tag] || 1" class="capitalize" />
      </li>
    </ul>
    <p v-else class="text-sm text-gray-500">No tags found</p>
    <p v-if="!shouldHide">Go back to <nuxt-link to="/blog">Blog</nuxt-link> to see all posts.</p>
  </div>
</template>

<script lang="ts" setup>
withDefaults(
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
</script>
