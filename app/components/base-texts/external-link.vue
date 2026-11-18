<template>
  <a
    :href="href"
    :title="typeof attrs.title === 'string' && attrs.title ? attrs.title : href"
    target="_blank"
    :rel="rel"
    v-bind="linkAttrs"
  >
    <slot />
    <GIcon v-if="hasIcon" name="material-symbols-light:open-in-new" class="inline-block ml-[2px]" />
    <sup v-if="isPdf" class="ml-[1px] font-semibold">PDF</sup>
  </a>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps({
  href: {
    type: String,
    required: true,
    default: () => '/',
  },
  hasIcon: {
    type: Boolean,
    required: false,
    default: () => false,
  },
})

const attrs = useAttrs()

const isPdf = computed(() => /\.pdf([?#]|$)/i.test(props.href))
const rel = computed(() => {
  const tokens = new Set(['me', 'noopener', 'noreferrer'])

  if (typeof attrs.rel === 'string') {
    for (const token of attrs.rel.split(/\s+/)) {
      if (token) tokens.add(token)
    }
  }

  return [...tokens].join(' ')
})
const linkAttrs = computed(() => {
  const rest = { ...attrs }
  delete rest.rel
  delete rest.title
  return rest
})
</script>
