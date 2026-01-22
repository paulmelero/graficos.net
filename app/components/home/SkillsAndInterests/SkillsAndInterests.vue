<template>
  <section ref="sectionRef" class="relative w-screen min-h-[200vh]">
    <div class="sticky top-0 flex min-h-[200vh] flex-col">
      <div class="container py-4">
        <h2 class="ibm text-3xl ibm font-thin">Personal Interests</h2>
      </div>

      <div class="relative flex-1 h-[200vh] flex items-center justify-start">
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
const scrollProgress = computed(() => {
  if (!sectionRef.value) {
    return 0
  }

  return lerp(0, 1, clamp((-y.value * 2) / height.value, 0, 1))
})

watch(isScrolling, update)
</script>
