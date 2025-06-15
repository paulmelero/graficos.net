<template>
  <div
    class="footer text-center text-gray-darker dark:text-gray-lightest pt-10 sm:flex sm:items-center sm:justify-center media"
    aria-label="Footer content"
    s
  >
    <div
      class="avatar grid items-center rounded-full mb-4 sm:mb-0 sm:mx-0 mx-auto overflow-hidden size-16 sm:size-24 bg-cover bg-center bg-no-repeat"
    />
    <div class="sm:ml-5 sm:text-left">
      <p class="text-xl leading-tight mb-0 title font-thin">Paul Melero</p>
      <p class="text-sm leading-tight mt-0 text-gray-dark dark:text-gray-light">Web Developer</p>
      <lazy-main-presentation-icons-menu class="justify-center sm:justify-start" />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.footer {
  padding-bottom: calc(150px + 3rem);
}
.avatar {
  background-image: url('~/assets/images/av.avif');
}
</style>
