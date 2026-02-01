<template>
  <div class="flex items-center">
    <images-social-networks :class="iconsClassNames" />
    <main-presentation-theme-switcher v-if="!hideThemeSwitcher" @click="$emit('click', $event)" />
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    iconsClassNames?: string
    hideThemeSwitcher?: boolean
  }>(),
  {
    iconsClassNames: '',
    hideThemeSwitcher: false,
  }
)
</script>
