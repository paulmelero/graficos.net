<template>
  <div class="relative">
    <button aria-controls="top-menu" @click="isOpen = !isOpen">
      <span class="sr-only"> Toggle Menu </span>
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
      </svg>
    </button>
    <transition appear>
      <section
        v-if="isOpen"
        id="top-menu"
        :aria-expanded="isOpen"
        aria-live="polite"
        class="card absolute z-10 top-full right-0 w-[300px]"
      >
        <ul class="divide-y dark:divide-gray-dark mb-0">
          <li v-for="link of links" :key="link.href" class="relative h-[3rem]">
            <nuxt-link
              :to="link.href"
              class="no-underline hover:underline absolute inset-0 leading-[3rem]"
              @click="isOpen = false"
              >{{ link.name }}</nuxt-link
            >
          </li>
        </ul>
        <hr class="dark:text-gray-dark" />
        <MainPresentationIconsMenu class="mt-6 justify-between" />
      </section>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { linksWithHome as links } from '../../config/pages'

const isOpen = ref(false)

defineExpose({ isOpen })
</script>
