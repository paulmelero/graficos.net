<template>
  <div ref="menuContainer" class="relative">
    <button
      @click="isOpen = !isOpen"
      :aria-label="isOpen ? 'Close menu' : 'Open menu'"
      :aria-expanded="isOpen"
      aria-controls="mobile-menu"
      class="relative z-[60] flex flex-col justify-center items-center w-10 h-10 gap-[6px] text-accent dark:text-actionDark"
    >
      <span
        :class="[
          'block h-0.5 w-6 bg-current rounded-full transition-all duration-300 origin-center bg-currentColor',
          isOpen ? 'translate-y-2 rotate-45' : '',
        ]"
      />
      <span
        :class="[
          'block h-0.5 w-6 bg-current rounded-full transition-all duration-300 origin-center bg-currentColor',
          isOpen ? 'opacity-0 scale-x-0' : '',
        ]"
      />
      <span
        :class="[
          'block h-0.5 w-6 bg-current rounded-full transition-all duration-300 origin-center bg-currentColor',
          isOpen ? '-translate-y-2 -rotate-45' : '',
        ]"
      />
    </button>

    <Transition
      enter-active-class="transition-opacity duration-300 ease-in"
      leave-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <nav
        v-if="isOpen"
        id="mobile-menu"
        ref="menu"
        tabindex="-1"
        class="fixed inset-0 z-50 flex gap-8 flex-col justify-between items-center bg-fwhite dark:bg-gray-darkest py-8"
        aria-label="Mobile navigation"
      >
        <ul class="flex flex-col items-center justify-center gap-6 list-none p-0 flex-grow mb-0">
          <li
            v-for="(link, index) of links"
            :key="link.href"
            class="transition-all duration-300 ease-out"
            :style="{
              transitionDelay: show ? `${index * 100}ms` : '0ms',
              opacity: show ? 1 : 0,
              transform: show ? 'translateX(0)' : 'translateX(16px)',
            }"
          >
            <nuxt-link
              :to="link.href"
              class="text-2xl no-underline text-black hover:text-accent dark:text-fwhite dark:hover:text-actionDark"
              @click="isOpen = false"
            >
              {{ link.name }}
            </nuxt-link>
          </li>
        </ul>
        <MainPresentationIconsMenu
          class="transition-all duration-300 ease-out"
          :style="{
            transitionDelay: show ? `${links.length * 100}ms` : '0ms',
            opacity: show ? 1 : 0,
            transform: show ? 'translateX(0)' : 'translateX(16px)',
          }"
        />
      </nav>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { useMagicKeys, useScrollLock } from '@vueuse/core'

import { linksWithHome as links } from '../../config/pages'

const isOpen = ref(false)
const show = ref(false)

defineExpose({ isOpen })

const { escape } = useMagicKeys()
const menuContainer = useTemplateRef('menuContainer')
const menuFocusTarget = useTemplateRef('menu')
const { focused } = useFocusWithin(menuContainer)

watchEffect(() => {
  if (escape?.value) {
    isOpen.value = false
  }
})

const scrollLock = useScrollLock(import.meta.client ? document.body : null)

watch(isOpen, async (open) => {
  scrollLock.value = open
  if (open) {
    await nextTick()
    requestAnimationFrame(() => {
      show.value = true
      menuFocusTarget.value?.focus()
    })
  } else {
    show.value = false
  }
})

watch(focused, (isFocused) => {
  if (!isFocused) {
    isOpen.value = false
  }
})
</script>
