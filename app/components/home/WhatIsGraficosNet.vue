<template>
  <section class="w-screen min-h-[50vh] flex flex-col group">
    <div class="container py-4 px-10">
      <BaseTextsTheTitle>
        <h2 class="text-3xl font-ibm dark:font-thin">What is Graficos.net?</h2>
      </BaseTextsTheTitle>
    </div>

    <div v-if="section" class="container sm:pt-32 px-10">
      <div class="sm:grid grid-cols-3 place-items-center flex flex-col gap-10">
        <div class="media flex justify-center items-start">
          <BrandTheLogo class="sm:opacity-20 sm:group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <ContentRenderer v-if="section" :value="section" class="col-span-2 article-post font-ibm" />
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
const SECTION = 'what-is-graficos-net'
const { data: section } = useAsyncData(SECTION, () =>
  queryCollection('homeSections').where('stem', '=', 'homeSections/what-is-graficos-net').first()
)
</script>
