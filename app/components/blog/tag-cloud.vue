<template>
  <div class="card">
    <h3 class="title font-thin">{{ sectionTitle }}</h3>
    <ul v-if="Object.keys(tags).length" class="list-reset flex gap-2 flex-wrap">
      <li v-for="(tag, i) in Object.keys(tags)" :key="i">
        <nuxt-link :to="`/blog/tag/${tag}`">
          <blog-tag-media :name="tag" :size="tags[tag]" class="capitalize" />
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    tags: Record<string, number>
    sectionTitle?: string
  }>(),
  {
    sectionTitle: 'Tags',
  }
)
</script>
