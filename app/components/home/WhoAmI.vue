<template>
  <section class="w-screen min-h-screen flex flex-col relative bg-gray-lightest dark:bg-primaryDark">
    <div class="container pt-24 px-10">
      <BaseTextsTheTitle>
        <h2 class="text-3xl font-ibm dark:font-thin">Who am I?</h2>
      </BaseTextsTheTitle>
    </div>

    <MainPresentationPatternEdges thickness="1em" class="opacity-20" />
    <div v-if="section" class="container py-24 px-10">
      <div class="sm:grid grid-cols-3 place-items-center flex flex-col-reverse gap-10">
        <ContentRenderer v-if="section" :value="section" class="col-span-2 article-post font-ibm" />
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
