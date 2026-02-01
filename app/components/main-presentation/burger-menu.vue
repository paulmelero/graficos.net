<template>
  <div class="relative">
    <button @click="isOpen = !isOpen">
      <span class="sr-only"> Toggle Menu </span>
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
      </svg>
    </button>
    <transition appear>
      <section
        v-if="isOpen"
        ref="menu"
        id="top-menu"
        :aria-expanded="isOpen"
        aria-live="polite"
        class="card absolute z-10 top-full right-0 w-[300px] -mr-2"
      >
        <ul class="divide-y dark:divide-gray-dark mb-0">
          <li v-for="link of links" :key="link.href" class="relative h-[3rem]">
            <nuxt-link
              :to="link.href"
              class="no-underline hover:underline absolute inset-0 leading-[3rem] text-black hover:text-accent dark:text-fwhite dark:hover:text-actionDark"
              @click="isOpen = false"
              >{{ link.name }}</nuxt-link
            >
          </li>
        </ul>
        <hr class="dark:text-gray-dark" />
        <MainPresentationIconsMenu class="mt-6 justify-between" />
      </section>
    </transition>
    <ClientOnly>
      <Teleport to="body">
        <transition appear>
          <buttton
            v-if="isOpen"
            type="button"
            class="fixed inset-0 bg-black/30 dark:bg-black/50 z-[9]"
            aria-hidden="true"
            @click.prevent="isOpen = false"
          ></buttton>
        </transition>
      </Teleport>
    </ClientOnly>
  </div>
</template>

<script lang="ts" setup>
import { useMagicKeys } from '@vueuse/core'

import { linksWithHome as links } from '../../config/pages'

const isOpen = ref(false)

defineExpose({ isOpen })

const { escape } = useMagicKeys()
const menuFocusTarget = useTemplateRef('menu')
const { focused } = useFocusWithin(menuFocusTarget)

watchEffect(() => {
  if (escape?.value) {
    isOpen.value = false
  }
})

watch(isOpen, (whenOpen) => {
  if (whenOpen) {
    menuFocusTarget.value?.focus()
  }
})

watch(focused, (isFocused) => {
  if (!isFocused) {
    isOpen.value = false
  }
})
</script>
