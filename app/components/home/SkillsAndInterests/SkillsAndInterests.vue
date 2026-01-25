<template>
  <section ref="sectionRef" class="relative w-screen min-h-[130vh] sm:min-h-[200vh]">
    <div class="sticky top-0 flex min-h-[130vh] sm:min-h-[200vh] flex-col">
      <div class="container mx-auto py-4 px-10">
        <base-texts-the-title>
          <h2 class="font-ibm text-3xl dark:font-thin">Personal Interests</h2>
          <template #subtitle>
            <p>I consider myself a multi-faceted individual with a wide range of interests and skills.</p>
          </template>
        </base-texts-the-title>
      </div>

      <div class="relative flex-1 h-[130vh] sm:h-[200vh] flex items-center justify-start">
        <HomeSkillsAndInterestsComponentsIsometricScene
          :scroll-progress="scrollProgress"
          @video-hover="handleVideoHover"
        />
        <HomeSkillsAndInterestsComponentsWordsCloud
          :related-to-map="{
            ART: 0,
            NATURE: 1,
            TECHNOLOGY: 2,
          }"
          :view-box="{ width: 800, height: 600 }"
          :active-topic
        />
        <HomeSkillsAndInterestsComponentsRecentProjects />
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { lerp, clamp } from 'three/src/math/MathUtils.js'

const activeTopic = ref<number | null>(null)
const sectionRef = ref<HTMLElement | null>(null)
const handleVideoHover = (index: number) => {
  activeTopic.value = index
}
const { isScrolling } = useWindowScroll()
const { y, height, update } = useElementBounding(sectionRef)
const scrollProgressTarget = computed(() => {
  if (!sectionRef.value || height.value <= 0) {
    return 0
  }

  return clamp((-y.value * 2) / height.value, 0, 1)
})

const scrollProgress = ref(scrollProgressTarget.value)

// Smooth scroll progress updates to avoid abrupt jumps that cause render jitter.
const { pause: pauseSmoothing, resume: resumeSmoothing } = useRafFn(() => {
  const target = scrollProgressTarget.value
  const next = lerp(scrollProgress.value, target, 0.16)

  if (Math.abs(next - target) < 0.001) {
    scrollProgress.value = target
    pauseSmoothing()
    return
  }

  scrollProgress.value = clamp(next, 0, 1)
})

watch(
  scrollProgressTarget,
  (target) => {
    if (!import.meta.client) {
      scrollProgress.value = target
      return
    }

    if (Math.abs(scrollProgress.value - target) < 0.001) {
      scrollProgress.value = target
      return
    }

    resumeSmoothing()
  },
  { immediate: true }
)

watch(isScrolling, update)
</script>
