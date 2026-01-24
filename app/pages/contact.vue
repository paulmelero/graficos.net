<template>
  <base-texts-the-title class="mb-24">
    <h1 class="text-3xl">{{ title }}</h1>
  </base-texts-the-title>

  <p>👋🏽 You can drop me a line here:</p>

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

  <p>Or open with...</p>

  <div class="w-full sm:w-2/3 md:w-1/2 lg-1/2">
    <a :href="`mailt&#111;&#58;${email}`" class="pill-button pill-ghost flex items-center gap-2 mb-4 no-underline">
      <GIcon name="octicon:mail-24" class="inline" />
      Default email client
    </a>

    <a
      :href="`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`"
      target="_blank"
      class="pill-button pill-ghost flex items-center gap-2 mb-4 no-underline"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="inline">
        <path
          fill="currentColor"
          d="M20 18h-2V9.25L12 13L6 9.25V18H4V6h1.2l6.8 4.25L18.8 6H20m0-2H4c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2"
        />
      </svg>
      <span>Gmail Web</span>
    </a>
    <a
      :href="`https://outlook.live.com/mail/0/deeplink/compose?to=${email}`"
      target="_blank"
      class="pill-button pill-ghost flex items-center gap-2 mb-4 no-underline"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256" class="inline">
        <path
          fill="currentColor"
          d="M88 144a16 16 0 1 1 16-16a16 16 0 0 1-16 16m144-32v96a16 16 0 0 1-16 16H88a16 16 0 0 1-16-16v-16H40a16 16 0 0 1-16-16V80a16 16 0 0 1 16-16h56V40a8 8 0 0 1 8-8h96a8 8 0 0 1 8 8v64h16a8 8 0 0 1 8 8M112 64h24a16 16 0 0 1 16 16v74.13l40-28.89V48h-80Zm-24 96a32 32 0 1 0-32-32a32 32 0 0 0 32 32m111.26 48L152 173.87V176a16 16 0 0 1-16 16H88v16ZM216 127.65L165.66 164L216 200.35Z"
        />
      </svg>
      <span>Outlook Web</span>
    </a>
  </div>

  <p class="mt-8">And I will be in contact with you shortly.</p>

  <hr class="my-8" />

  <p>You can also contact me on the social media accounts where I am most active:</p>

  <images-social-networks class="flex-col gap-4" :should-display-names="true" />
</template>

<script lang="ts" setup>
import { useClipboard } from '@vueuse/core'

import BaseTextsEmail from '~/components/base-texts/email.vue'

const title = 'Contact'

const emailComp = useTemplateRef('emailComp')
const email = computed(() => emailComp.value?.el?.innerText)

const { copy, copied, isSupported } = useClipboard({ source: email.value || '' })
</script>
