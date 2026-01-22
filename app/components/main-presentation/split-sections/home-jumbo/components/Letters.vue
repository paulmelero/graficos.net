<template>
  <svg
    class="[container-type:inline-size] w-full select-none text-[clamp(1rem,7cqi,12cqi)]"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid meet"
    fill="none"
    aria-hidden="true"
    :viewBox="svgViewBox"
  >
    <g v-for="(shape, index) in letterShapes" :key="shape.key" class="w-full ibm font-thin group" fill="currentColor">
      <text
        :x="shape.x"
        :y="baseline"
        text-anchor="middle"
        dominant-baseline="middle"
        class="text-[400px] sm:text-[72px]"
        :class="[
          `sm:[--tw-translate-x:0]`,
          {
            'text-primary translate-x-[--custom-translate-x] sm:translate-x-0': index === 0,
            'hidden sm:block': index !== 0,
          },
        ]"
        :style="`--custom-translate-x:${width / 2 - shape.x}px`"
        :data-order="shape.letter.o"
        :data-ascii="shape.letter.a"
      >
        {{ shape.letter.l }}
      </text>
      <text
        :x="shape.x + LETTER_BOX / 2 - 20"
        :y="topBaseline"
        text-anchor="middle"
        dominant-baseline="middle"
        class="text-secondary group-hover:text-actionDark dark:group-hover:text-accentDark transition-[color] duration-300 ease-in-out hidden md:block"
        :font-size="8"
        :data-order="shape.letter.o"
        :data-ascii="shape.letter.a"
      >
        {{ shape.letter.a }}
      </text>
      <text
        :x="shape.x"
        :y="bottomline"
        text-anchor="middle"
        dominant-baseline="middle"
        class="text-gray-light group-hover:text-gray-dark dark:text-gray-light dark:group-hover:text-fwhite transition-[color] duration-300 ease-in-out hidden md:block"
        :font-size="8"
        :data-order="shape.letter.o"
        :data-ascii="shape.letter.a"
      >
        {{ shape.letter.o !== undefined ? shape.letter.o : '-' }}
      </text>
    </g>
    <line
      v-if="firstEightLine"
      :x1="firstEightLine.x1"
      :x2="firstEightLine.x2"
      :y1="baselineLine"
      :y2="baselineLine"
      class="text-gray-dark dark:text-fwhite opacity-20 hidden sm:block"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
    />
    <line
      v-if="lastThreeLine"
      :x1="lastThreeLine.x1"
      :x2="lastThreeLine.x2"
      :y1="baselineLine"
      :y2="baselineLine"
      class="text-gray-dark dark:text-fwhite opacity-20 hidden sm:block"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
    />
    <text
      v-if="firstEightLine"
      :x="(firstEightLine.x2 - firstEightLine.x1) / 2"
      :y="baselineLine + 16"
      fill="currentColor"
      class="ibm font-thin text-gray-dark dark:text-fwhite hidden md:block"
      text-anchor="middle"
      dominant-baseline="middle"
      :font-size="8"
    >
      78
    </text>
    <text
      v-if="lastThreeLine"
      :x="lastThreeLine.x1 + (lastThreeLine.x2 - lastThreeLine.x1) / 2"
      :y="baselineLine + 16"
      fill="currentColor"
      class="ibm font-thin text-gray-dark dark:text-fwhite hidden md:block"
      text-anchor="middle"
      dominant-baseline="middle"
      :font-size="8"
    >
      39
    </text>
    <text
      v-if="lastThreeLine && firstEightLine"
      :x="(lastThreeLine.x1 - firstEightLine.x2) / 2 + firstEightLine.x2"
      :y="baselineLine + 16"
      fill="currentColor"
      class="ibm font-thin text-gray-dark dark:text-fwhite hidden md:block"
      text-anchor="middle"
      dominant-baseline="middle"
      :font-size="8"
    >
      / 2 =
    </text>
  </svg>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const LETTER_BOX = 100
const VIEWBOX_HEIGHT = 120
const FONT_SIZE = 72

const props = defineProps<{
  letters: Readonly<
    {
      l: string
      a: number
      o?: number | undefined
    }[]
  >
}>()

const width = computed(() => LETTER_BOX * props.letters.length)
const svgViewBox = computed(() => {
  return `0 0 ${width.value} ${VIEWBOX_HEIGHT}`
})

const baseline = VIEWBOX_HEIGHT / 2
const topBaseline = baseline - FONT_SIZE / 2
const bottomline = baseline + FONT_SIZE / 2 + 12
const baselineLine = bottomline + 32

const letterShapes = computed(() =>
  props.letters.map((letter, index) => ({
    key: `${letter.l}-${index}`,
    letter,
    o: letter.o,
    a: letter.a,
    x: LETTER_BOX * index + LETTER_BOX / 2,
  }))
)

const firstEightLine = computed(() => {
  const span = Math.min(props.letters.length, 8)
  if (span === 0) {
    return null
  }

  return {
    x1: 0,
    x2: LETTER_BOX * span,
  }
})

const lastThreeLine = computed(() => {
  const span = Math.min(props.letters.length, 3)
  if (span === 0) {
    return null
  }

  const start = Math.max(props.letters.length - span, 0)

  return {
    x1: LETTER_BOX * start,
    x2: LETTER_BOX * props.letters.length,
  }
})
</script>
