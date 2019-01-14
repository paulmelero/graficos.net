<template>
  <div
    class="text-center text-grey-darker pt-10 pb-12 sm:flex sm:items-center sm:justify-center media"
    aria-label="Footer content"
  >
    <img
      class="block h-16 sm:h-24 rounded-full sm:mb-0 sm:mx-0 mx-auto"
      src="/avatar.jpg"
      alt="Paul Melero's picture; smiling.">
    <div class="sm:ml-5 sm:text-left">
      <p class="text-xl leading-tight mb-0">Paul melero</p>
      <p class="text-sm leading-tight text-grey-dark mb-4">Web Developer</p>
      <social-networks :dark="false" class="flex justify-center mx-auto"></social-networks>
    </div>
  </div>
</template>

<script>
const SocialNetworks = () => import('~/components/images/social-networks')
export default {
  components: {
    SocialNetworks,
  }
}
</script>
