<template>
  <div class="space-y-24">
    <section>
      <main-presentation-split-sections-home-jumbo />
    </section>
    <HomeWhatIsGraficosNet />
    <HomeWhoAmI />
    <HomeSkillsAndInterests />
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
