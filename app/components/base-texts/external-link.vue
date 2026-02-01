<template>
  <a :href="href" :title="href" target="_blank" rel="me noopener noreferer">
    <slot />
    <GIcon v-if="hasIcon" name="material-symbols-light:open-in-new" class="inline-block ml-[2px]" />
  </a>
</template>

<script setup lang="ts">
defineProps({
  href: {
    type: String,
    required: true,
    default: () => '/',
  },
  hasIcon: {
    type: Boolean,
    required: false,
    default: () => false,
  },
})
</script>
