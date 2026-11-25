<template>
  <article class="post-container">
    <BaseTextsTheTitle class="mb-24">
      <h1 class="text-2xl sm:text-3xl">GRAFICOZZ (graficos.net's Newsletter)</h1>
      <template #subtitle>
        <p>Curated news in Web development, drops of cool links curated by hand.</p>
      </template>
    </BaseTextsTheTitle>

    <div class="article-post font-ibm">
      <p>
        GRAFICOZZ is a newsletter about the web platform. Each Drop collects new entries in the collections, useful
        tools, browser and baseline changes, and the occasional longer thought. When there are enough of them, I send a
        Drop.
      </p>

      <h2>What to expect</h2>
      <ul>
        <li>New entries in the collections</li>
        <li>Links and tools that did not make the blog</li>
        <li>Baseline and browser platform news</li>
        <li>Random thoughts, sometimes</li>
      </ul>

      <p><strong>How often?</strong> No fixed schedule. Roughly monthly, sometimes less.</p>
    </div>

    <NewsletterSignup variant="page" class="mt-12" />

    <p class="mt-6 text-sm text-gray-dark dark:text-gray-light">
      I only use your email to send GRAFICOZZ. Read the
      <NuxtLink to="/privacy">privacy policy</NuxtLink>.
    </p>
  </article>
</template>

<script lang="ts" setup>
useSeoMeta({
  title: 'GRAFICOZZ',
  description:
    'GRAFICOZZ is a newsletter about the web platform, collections, and things worth sharing. Each issue is a Drop. No fixed schedule.',
})
</script>
