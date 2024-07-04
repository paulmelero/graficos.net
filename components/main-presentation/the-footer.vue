<template>
  <div
    class="footer text-center text-gray-darker dark:text-gray-lightest pt-10 sm:flex sm:items-center sm:justify-center media"
    aria-label="Footer content"
    s
  >
    <div
      class="avatar grid items-center rounded-full sm:mb-0 sm:mx-0 mx-auto overflow-hidden size-16 sm:size-24 bg-cover bg-center bg-no-repeat"
    ></div>
    <div class="sm:ml-5 sm:text-left">
      <p class="text-xl leading-tight mb-0 title font-thin">Paul melero</p>
      <p class="text-sm leading-tight mt-0 text-gray-dark dark:text-gray-light">Web Developer</p>
      <lazy-images-social-networks class="flex justify-center sm:justify-start mx-auto" />
    </div>
  </div>
</template>

<script setup></script>

<style lang="postcss" scoped>
.footer {
  padding-bottom: calc(192px + 3rem);
}
.avatar {
  background-image: url('~/assets/images/av.avif');
}
</style>
