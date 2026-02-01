<template>
  <WordsCloudBase
    :active-topic="activeTopic"
    :view-box="viewBox"
    :svg-class="svgClass"
    cache-key="skills-and-interests-cloud-positions-desktop"
    filter-id="words-cloud-desktop-filter"
    force-layout="default"
  />
</template>

<script lang="ts" setup>
import { toRefs } from 'vue'
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
    viewBox: () => ({ width: 800, height: 600 }),
    svgClass:
      'absolute inset-x-0 top-[8vh] w-[calc(100%-2.5rem)] mx-auto h-[75vh] sm:top-[5vh] sm:h-screen z-20 pointer-events-none',
  }
)

const { activeTopic, viewBox, svgClass } = toRefs(props)
</script>
