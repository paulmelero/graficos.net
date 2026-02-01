<template>
  <nav
    class="flex items-center justify-between bg-fwhite dark:bg-gray-darkest dark:text-fwhite sm:sticky top-0"
    aria-label="Main Navigation"
  >
    <nuxt-link
      class="flex items-center text-black hover:text-accent dark:text-fwhite dark:hover:text-actionDark flex-no-shrink mx-6 py-4 disable-underline disable-transition disable-hover"
      to="/"
      aria-label="Go to Home Page"
      @click="closeBurgerMenu"
    >
      <images-logo class="h-8 transition:color disable-hover" />
    </nuxt-link>
    <ul class="pl-0 h-full w-full flex-1 flex-grow items-center my-0 hidden sm:flex justify-start">
      <template v-for="(link, i) in links" :key="i">
        <li v-if="link.head" class="inline-block">
          <nuxt-link
            :to="link.href"
            :title="link.title"
            class="my-0 text-sm text-black hover:text-accent dark:text-fwhite dark:hover:text-actionDark disable-hover mr-4"
            >{{ link.name }}</nuxt-link
          >
        </li>
      </template>
    </ul>
    <div class="mr-2 justify-self-end">
      <main-presentation-burger-menu ref="burgerMenu" class="flex sm:hidden" />
      <main-presentation-icons-menu class="hidden sm:flex" />
    </div>
  </nav>
</template>

<script lang="ts" setup>
import type BurgerMenu from './burger-menu.vue'
import { links } from '../../config/pages'

const burgerMenu = ref<InstanceType<typeof BurgerMenu> | null>(null)
const closeBurgerMenu = () => {
  if (burgerMenu.value && burgerMenu.value.isOpen) {
    burgerMenu.value.isOpen = false
  }
}
</script>

<style scoped>
abbr[title] {
  text-decoration: none;
}
</style>
