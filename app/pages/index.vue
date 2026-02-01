<template>
  <div class="space-y-24">
    <section class="hidden sm:block">
      <main-presentation-split-sections-home-jumbo />
    </section>
    <HomeWhatIsGraficosNet />
    <HomeWhoAmI />
    <LazyHydrationHomeSkillsAndInterests />
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

const LazyHydrationHomeSkillsAndInterests = defineLazyHydrationComponent(
  'visible',
  () => import('../components/home/SkillsAndInterests/SkillsAndInterests.vue')
)
</script>
