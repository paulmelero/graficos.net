<template>
  <div class="flex items-center">
    <images-social-networks :class="iconsClassNames" />
    <ColorScheme placeholder="💬">
      <button
        class="unstyled flex items-center justify-center w-8 rounded-full p-0 ml-3 relative"
        aria-label="Toggle color mode"
        title="Toggle color mode"
        type="button"
        @click="onColorModeToggle"
      >
        <GIcon
          v-if="colorMode.preference === 'dark'"
          :size="24"
          name="octicon:moon-16"
        />
        <GIcon
          v-if="colorMode.preference === 'system'"
          :size="24"
          name="octicon:codespaces-24"
        />
        <GIcon
          v-if="colorMode.preference === 'light'"
          :size="24"
          name="octicon:sun-16"
        />
      </button>
    </ColorScheme>
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    iconsClassNames?: string
  }>(),
  {
    iconsClassNames: '',
  }
)
const colorMode = useColorMode()
const colorModes = ['dark', 'light', 'system']
const onColorModeToggle = () => {
  // preference can be: 'dark', 'light', 'system' or 'unknown'
  colorMode.preference = colorModes[(colorModes.indexOf(colorMode.preference) + 1) % colorModes.length]
}
</script>
