<template>
  <section>
    <base-texts-the-title class="text-center logo-placeholder">
      <h1 id="main-title" class="sr-only">Graficos.net</h1>
      <BrandTheLogo />
    </base-texts-the-title>
    <section class="container mx-auto sm:mt-8 px-4" aria-label="Main section.">
      <h2 class="text-2xl mb-8">Hi! I'm Paul Melero, Frontend Engineer.</h2>
      <h3 slot="title" class="text-xl mb-6">
        <TypedText>About Graficos.NET and me</TypedText>
        <Cursor />
      </h3>
      <ContentRenderer v-if="page" :value="page" />
    </section>
  </section>
</template>

<script lang="ts" setup>
import { tw } from '~/core/tw'
import { useIntervalFn } from '@vueuse/core'

useHead({
  title: 'Home',
  meta: [
    {
      name: 'description',
      content: 'Paul Melero, Engineer, Web Developer and Visual Artist.',
    },
  ],
})

const { data: page } = await useAsyncData('home', async () => {
  const content = await queryCollection('pages').path('/pages').first()

  return content
})

const Cursor = defineComponent({
  setup() {
    return () => h('span', { class: tw`animate-blink` }, '|')
  },
})

const TypedText = defineComponent({
  setup(_, { slots }) {
    const originalText = String(slots.default?.()[0]?.children || '')

    const updatedText = ref('')

    const i = ref(0)
    useIntervalFn(() => {
      if (originalText.length === 0) {
        updatedText.value = ''
        return
      }

      if (import.meta.server) {
        updatedText.value = originalText
        return
      }

      if (i.value < originalText.length) {
        updatedText.value += originalText[i.value]
        i.value++
      }
    }, 100)

    return () => h('span', updatedText.value)
  },
})
</script>
