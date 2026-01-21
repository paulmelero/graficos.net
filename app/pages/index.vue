<template>
  <div>
    <section>
      <main-presentation-split-sections-home-jumbo />
    </section>
    <section class="w-screen h-screen flex items-center justify-center">
      <HomeIsometricScene />
    </section>
  </div>
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
