<template>
  <div class="flex items-center justify-between">
    <images-social-networks :class="iconsClassNames" />
    <ColorScheme placeholder="💬">
      <button
        @click="onColorModeToggle"
        class="unstyled flex items-center justify-center w-8 rounded-full p-0 ml-3 relative"
        aria-label="Toggle color mode"
        title="Toggle color mode"
        type="button"
      >
        <Icon size="24" v-if="colorMode.preference === 'dark'" name="octicon:moon-16" />
        <Icon size="24" v-if="colorMode.preference === 'system'" name="octicon:codespaces-24" />
        <Icon size="24" v-if="colorMode.preference === 'light'" name="octicon:sun-16" />
      </button>
    </ColorScheme>
  </div>
</template>

<script setup lang="ts">
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
