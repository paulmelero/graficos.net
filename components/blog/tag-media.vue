<template>
  <span>
    {{ name }}
    <!-- <span class="rounded-full inline-block text-center bg-accent w-4 text-white">{{ size }}</span> -->
  </span>
</template>
<script>
export default {
  props: {
    name: {
      type: String
    },
    size: {
      type: Number
    },
  }
}
</script>
