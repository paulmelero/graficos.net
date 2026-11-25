<template>
  <div>
    <section v-if="variant === 'home'" class="w-screen">
      <div class="container mx-auto px-10">
        <BaseTextsTheTitle class="mb-12">
          <h2 class="text-2xl sm:text-3xl">GRAFICOZZ (graficos.net's Newsletter)</h2>
          <template #subtitle>
            <p>Curated news in Web development, drops of cool links curated by hand, whenever I have enough.</p>
          </template>
        </BaseTextsTheTitle>

        <div class="sm:grid sm:grid-cols-3 sm:gap-10">
          <div class="mb-8 font-ibm text-sm text-gray-dark dark:text-gray-light sm:mb-0">
            <p>Each Drop collects new collections, web platform notes, and the things that did not make the blog.</p>
            <p class="mt-4">No fixed schedule. I send when there is enough worth sharing.</p>
          </div>
          <NewsletterForm class="sm:col-span-2" />
        </div>
      </div>
    </section>

    <NewsletterForm v-else-if="variant === 'page'" />

    <aside v-else class="mt-16">
      <h2 class="mb-2 text-2xl font-title">Get the next Drop by email</h2>
      <p class="mb-6 text-sm text-gray-dark dark:text-gray-light">
        Each Drop collects new collections, useful links, and the occasional thought. No fixed schedule.
      </p>
      <NewsletterForm />
    </aside>
  </div>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{ variant?: 'home' | 'page' | 'post' }>(), {
  variant: 'home',
})
</script>
