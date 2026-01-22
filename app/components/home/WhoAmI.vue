<template>
  <section class="w-screen min-h-screen flex flex-col relative bg-primaryDark">
    <div class="container py-4">
      <h2 class="text-3xl ibm font-thin">Who am I?</h2>
    </div>

    <MainPresentationPatternEdges :thickness="10" class="opacity-20" />
    <div v-if="section" class="container pt-32">
      <div class="sm:grid grid-cols-3 place-items-center flex flex-col-reverse gap-10">
        <ContentRenderer v-if="section" :value="section" class="col-span-2 article-post ibm" />
        <div class="media flex justify-center items-start">
          <NuxtImg src="/images/sticker.webp" alt="colourful explosion around smiling man" />
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import GIcon from '../GIcon.vue'

const SECTION = 'who-am-i'
const { data: section } = useAsyncData(SECTION, () =>
  queryCollection('homeSections').where('stem', '=', 'homeSections/who-am-i').first()
)
</script>
