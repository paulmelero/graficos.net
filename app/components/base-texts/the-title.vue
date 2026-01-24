<template>
  <header
    :class="{
      'pb-8': !dense,
    }"
  >
    <div class="mb-2 font-title">
      <slot />
    </div>
    <slot name="subtitle" />
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
