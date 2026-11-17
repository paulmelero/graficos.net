<template>
  <section v-if="featured.length" class="w-screen">
    <div class="container mx-auto px-10">
      <BaseTextsTheTitle class="mb-12">
        <h2 class="text-2xl sm:text-3xl">Collections</h2>
        <template #subtitle>
          <p>
            Some cool things I discovered on the Internet!
          </p>
        </template>
      </BaseTextsTheTitle>

      <div class="sm:grid grid-cols-3 place-items-center flex flex-col-reverse gap-10">
        <ContentRenderer v-if="section" :value="section" class="article-post font-ibm" />
        <CollectionsCollectionGrid :items="featured" class="col-span-2"/>
      </div>

      <p class="mt-8 font-ibm">
        <NuxtLink to="/collections">Browse all collections</NuxtLink>
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { getFeaturedCollections } from '../../config/collections'

const { collections } = useCollections()
const featured = computed(() => getFeaturedCollections(collections.value ?? []))

const SECTION = 'collections-excerpt'
const { data: section } = useAsyncData(SECTION, () =>
  queryCollection('homeSections').where('stem', '=', 'homeSections/collections-excerpt').first()
)
</script>

