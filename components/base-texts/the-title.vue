<template>
  <header
    :class="{
      'pb-8': !dense,
    }"
  >
    <div class="mb-2 title-bold">
      <slot name="title"></slot>
    </div>
    <slot name="subtitle"></slot>
  </header>
</template>

<script>
export default {
  props: {
    dense: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
