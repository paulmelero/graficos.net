<template>
  <ClientOnly>
    <ColorScheme placeholder="💬">
      <div class="ml-3" v-bind="$attrs">
        <div
          class="relative isolate flex items-center gap-1 rounded-full border border-black/10 bg-black/5 p-1 shadow-xs backdrop-blur dark:border-white/10 dark:bg-white/5"
          role="group"
          aria-label="Toggle color theme"
        >
          <span
            class="pointer-events-none absolute left-[anchor(center)] top-[anchor(center)] -translate-x-1/2 -translate-y-1/2 size-9 rounded-full border border-primary/60 bg-primary/10 transition-all duration-300 ease-out"
            :style="`position-anchor:--color-mode-${activeMode};`"
            aria-hidden="true"
          />
          <button
            v-for="mode in colorModes"
            :key="mode"
            type="button"
            :class="[
              'relative flex size-9 items-center justify-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/60',
              mode === activeMode
                ? 'text-primary'
                : 'text-gray-dark hover:text-accent dark:text-gray-light dark:hover:text-actionDark',
            ]"
            :style="`anchor-name:--color-mode-${mode}`"
            :aria-pressed="mode === activeMode"
            :aria-label="mode === activeMode ? 'Mode ' + mode : ariaLabels[mode]"
            :title="mode === activeMode ? 'Mode ' + mode : ariaLabels[mode]"
            @click="setColorMode(mode)"
          >
            <GIcon :size="22" :name="mode === activeMode ? iconsActive[mode] : iconsInactive[mode]" />
          </button>
        </div>
      </div>
    </ColorScheme>
  </ClientOnly>
</template>

<script lang="ts" setup>
defineOptions({
  inheritAttrs: false,
})

const emit = defineEmits<{
  (event: 'click', mode: ColorMode): void
}>()

const colorMode = useColorMode()
const colorModes = ['dark', 'light', 'system'] as const
type ColorMode = (typeof colorModes)[number]
const isKnownColorMode = (mode: string): mode is ColorMode => colorModes.includes(mode as ColorMode)

const activeMode = computed<ColorMode>(() =>
  isKnownColorMode(colorMode.preference) ? (colorMode.preference as ColorMode) : 'light'
)

const setColorMode = (mode: ColorMode) => {
  if (colorMode.preference === mode) {
    emit('click', mode)
    return
  }
  colorMode.preference = mode
  emit('click', mode)
}

const ariaLabels: Record<ColorMode, string> = {
  dark: 'Switch to dark mode',
  light: 'Switch to light mode',
  system: 'Switch to system mode',
}

const iconsActive = {
  dark: 'material-symbols-light:dark-mode',
  light: 'material-symbols-light:sunny-rounded',
  system: 'octicon:codespaces-24',
} as const

const iconsInactive = {
  dark: 'material-symbols-light:dark-mode-outline',
  light: 'material-symbols-light:light-mode-outline',
  system: 'octicon:codespaces-24',
} as const
</script>
