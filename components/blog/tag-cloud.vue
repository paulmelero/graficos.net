<template>
  <div>
  <ul
    class="list-reset"
    v-if="tags.length"
  >
    <li
      v-for="(tag, i) in tags"
      :key="i"
    >
      <tag-media :name="tag.name" :size="tag.size"></tag-media>
    </li>
  </ul>
  </div>
</template>

<script>
/* class Tag {
  name = ''
  size = 1
  cosntructor(
    name,
    size,
  ) {
    this.name = name
    this.size = size
  }
}
 */
export default {
  props: {
    tags: {
      type: Array,
      default: () => []
    }
  }
}
</script>
