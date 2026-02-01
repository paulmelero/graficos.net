<template>
  <WordsCloudBase
    :active-topic="activeTopic"
    :view-box="viewBox"
    :svg-class="svgClass"
    :layout-config="layoutConfig"
    cache-key="skills-and-interests-cloud-positions-mobile"
    filter-id="words-cloud-mobile-filter"
    force-layout="compact"
  />
</template>

<script lang="ts" setup>
import { computed, toRefs } from 'vue'
import WordsCloudBase from './WordsCloudBase.vue'

const props = withDefaults(
  defineProps<{
    activeTopic: number | null
    viewBox?: {
      width: number
      height: number
    }
    svgClass?: string
  }>(),
  {
    viewBox: () => ({ width: 640, height: 520 }),
    svgClass: 'absolute inset-x-0 top-[12vh] w-[calc(100%-1.5rem)] mx-auto h-[70vh] z-20 pointer-events-none',
  }
)

const layoutConfig = computed(() => ({
  compact: {
    heightMultiplier: 1,
    metrics: {
      horizontalOffset: 12,
      averageCharWidth: 6.5,
      extraLineWidth: 12,
      minLineWidth: 36,
      diagonalLineLength: 48,
      fontSize: 20,
      collisionPaddingX: 30,
      collisionPaddingY: 18,
    },
  },
}))

const { activeTopic, viewBox, svgClass } = toRefs(props)
</script>
