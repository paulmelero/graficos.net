<template>
  <footer role="contentinfo" class="bg-fwhite dark:bg-gray-darkest">
    <div class="container mx-auto grid min-h-[50vh] items-center gap-8 px-10 lg:grid-cols-[auto_1fr_auto]">
      <div class="hidden lg:flex lg:justify-end">
        <svg
          class="w-16 h-16 mx-auto lg:mx-0 dashed-triangle"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          fill="none"
        >
          <pattern
            id="pattern-checkers-footer"
            x="0"
            y="0"
            width="100%"
            height="1em"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
            fill="var(--border-color)"
          >
            <line class="dashed-line" x1="0" y1="8" x2="100%" y2="8" stroke-dasharray="8 4" />
          </pattern>
          <polygon
            stroke-width="2"
            stroke-dasharray="4 4"
            points="
          98,2
          98,98
          2,98
        "
            fill="url(#pattern-checkers-footer)"
          />
        </svg>
      </div>
      <div
        class="text-center text-gray-darker dark:text-gray-lightest lg:flex lg:items-center lg:justify-center font-ibm pt-8 lg:pt-0"
      >
        <NuxtImg
          src="/images/sticker.webp"
          width="96"
          height="119"
          alt="colourful explosion around smiling man"
          class="mb-4 lg:mb-0 lg:mx-0 mx-auto w-16 lg:w-24 h-auto"
        />
        <div class="lg:ml-5 lg:text-left">
          <p class="text-xl leading-tight mb-0 dark:font-thin">Paul Melero</p>
          <p class="text-sm leading-tight mt-0 dark:font-thin text-gray-dark dark:text-primary mb-4">
            human | engineer
          </p>

          <main-presentation-icons-menu hide-theme-switcher class="justify-center lg:justify-start" />
        </div>
      </div>
      <div
        class="flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:justify-center sm:gap-12 lg:justify-start"
      >
        <nav aria-labelledby="footer-navigation-heading" class="flex flex-col items-center sm:items-start">
          <h2
            id="footer-navigation-heading"
            class="font-ibm-sans font-bold uppercase text-gray-dark dark:text-gray-light mb-4"
          >
            Navigation
          </h2>
          <ul class="flex flex-col gap-2 text-center sm:text-start">
            <li v-for="link in footerNavigation" :key="link.name">
              <NuxtLink :to="link.href">{{ link.name }}</NuxtLink>
            </li>
          </ul>
        </nav>
        <nav aria-labelledby="footer-sharing-heading" class="flex flex-col items-center sm:items-start">
          <h2
            id="footer-sharing-heading"
            class="font-ibm-sans font-bold uppercase text-gray-dark dark:text-gray-light mb-4"
          >
            Sharing
          </h2>
          <ul class="flex flex-col gap-2 text-center sm:text-start">
            <li v-for="link in footerSharing" :key="link.name">
              <NuxtLink :to="link.href">{{ link.name }}</NuxtLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { footerNavigation, footerSharing } from '@/config/pages'
</script>

<style>
.dashed-triangle {
  stroke: var(--border-color);
}

.dark .dashed-triangle {
  stroke: var(--border-color-dark);
}
</style>
