<template>
  <section>
    <main-presentation-split-sections-home-jumbo />
  </section>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'full',
})

useHead({
  title: 'Home',
  meta: [
    {
      name: 'description',
      content: 'Paul Melero, Web Engineer.',
    },
  ],
})
</script>
