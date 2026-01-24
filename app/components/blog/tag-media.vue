<template>
  <span :class="[tagSize]" class="leading-6">
    {{ name }}
  </span>
</template>

<script>
const sizesTable = {
  1: 'text-base',
  2: 'text-xl',
  3: 'text-2xl',
}

export default {
  props: {
    name: {
      type: String,
      default: '',
    },
    size: {
      type: Number,
      required: true,
    },
  },
  computed: {
    tagSize() {
      return this.size > 3 ? 'text-3xl' : sizesTable[this.size] || 'text-base'
    },
  },
}
</script>
