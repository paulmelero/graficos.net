<template>
  <div
    class="footer text-center text-gray-darker dark:text-gray-lightest pt-10 sm:flex sm:items-center sm:justify-center media"
    aria-label="Footer content"
  >
    <img
      class="block h-16 sm:h-24 rounded-full sm:mb-0 sm:mx-0 mx-auto"
      src="~/assets/images/avatar.jpg"
      alt="Paul Melero's picture; smiling."
    />
    <div class="sm:ml-5 sm:text-left">
      <p class="text-xl leading-tight mb-0 title font-thin">Paul melero</p>
      <p class="text-sm leading-tight mt-0 text-gray-dark dark:text-gray-light">Web Developer</p>
      <social-networks class="flex justify-center sm:justify-start mx-auto"></social-networks>
    </div>
  </div>
</template>

<script setup>
import { tw } from '~/core/tw'

const SocialNetworks = defineAsyncComponent(() => import('~/components/images/social-networks.vue'))
</script>

<style scoped>
.footer {
  padding-bottom: calc(192px + 3rem);
}
</style>
