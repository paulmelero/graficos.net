<template>
  <div class="card">
    <h3 class="title font-thin">{{ sectionTitle }}</h3>
    <ul class="list-reset" v-if="Object.keys(tags).length">
      <li v-for="(tag, i) in Object.keys(tags)" :key="i" class="inline">
        <nuxt-link :to="`/blog/tag/${tag}`">
          <tag-media :name="tag" :size="tags[tag]" class="capitalize"></tag-media>
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
const TagMedia = () => import('~/components/blog/tag-media')

export default {
  props: {
    tags: {
      type: Object,
      default: () => {},
    },
    sectionTitle: {
      type: String,
      default: 'Tags',
    },
  },
  components: {
    TagMedia,
  },
}
</script>
