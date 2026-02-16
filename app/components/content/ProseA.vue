<template>
  <BaseTextsExternalLink
    v-if="isExternal"
    :href="props.href"
    :has-icon="true"
    v-bind="attrs"
  >
    <slot />
  </BaseTextsExternalLink>

  <NuxtLink
    v-else
    :href="props.href"
    :target="props.target"
    v-bind="attrs"
  >
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'

const props = defineProps({
  href: {
    type: String,
    default: '',
  },
  target: {
    type: String as PropType<'_blank' | '_parent' | '_self' | '_top' | (string & object) | null | undefined>,
    default: undefined,
    required: false,
  },
})

const attrs = useAttrs()
const currentOrigin = useRequestURL().origin

const isExternal = computed(() => {
  if (!props.href || props.href.startsWith('#')) return false

  try {
    const url = new URL(props.href, currentOrigin)
    return /^https?:$/.test(url.protocol) && url.origin !== currentOrigin
  }
  catch {
    return false
  }
})
</script>
