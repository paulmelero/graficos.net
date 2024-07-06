<template>
  <div class="relative">
    <button @click="isOpen = !isOpen" aria-controls="top-menu">
      <span class="sr-only"> Toggle Menu </span>
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
      </svg>
    </button>
    <transition appear>
      <section
        v-if="isOpen"
        :aria-expanded="isOpen"
        aria-live="polite"
        id="top-menu"
        class="card absolute z-10 top-full right-0 w-[300px]"
      >
        <ul>
          <li v-for="(link, index) of links" :key="link.href" class="mb-3">
            <nuxt-link :to="link.href" class="no-underline hover:underline" @click="isOpen = false">{{
              link.name
            }}</nuxt-link>
            <hr v-if="index !== links.length - 1" class="opacity-10 my-2" />
          </li>
        </ul>
        <hr class="opacity-50 my-2" />
        <MainPresentationIconsMenu class="mt-4" />
      </section>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { linksWithHome as links } from './pages'

const isOpen = ref(false)

defineExpose({ isOpen })
</script>
