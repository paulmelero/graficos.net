<template>
  <div class="post-container">
    <BaseTextsTheTitle class="mb-24">
      <h1 class="text-3xl">{{ title }}</h1>

      <template #subtitle>
        <p class="text-lg mt-4">Feel free to reach out to me via email or through my social media accounts.</p>
      </template>
    </BaseTextsTheTitle>

    <p class="p-4 rounded-md bg-fwhite dark:bg-gray-dark text-gray-darkest dark:text-gray-lightest font-thin">
      <BaseTextsEmail ref="emailComp" />
    </p>
    <ClientOnly>
      <div v-if="isSupported">
        <button type="button" @click="copy(email)" class="pill-button flex items-center gap-2">
          <GIcon name="octicon:copy-24" class="inline" />
          {{ copied ? 'Copied' : 'Copy' }} to clipboard{{ copied ? '!' : '' }}
        </button>
      </div>
    </ClientOnly>

    <hr class="my-8" />

    <p>You can also contact me on the social media accounts where I am most active:</p>

    <images-social-networks class="flex-col gap-4" :should-display-names="true" :only-socials="true" />
  </div>
</template>

<script lang="ts" setup>
import { useClipboard } from '@vueuse/core'

import BaseTextsEmail from '~/components/base-texts/email.vue'

const title = 'Contact'

const emailComp = useTemplateRef('emailComp')
const email = computed(() => emailComp.value?.el?.innerText)

const { copy, copied, isSupported } = useClipboard({ source: email.value || '' })
</script>
