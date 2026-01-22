<template>
  <svg
    class="absolute inset-x-0 top-0 w-full h-screen z-20 pointer-events-none"
    viewBox="0 0 800 600"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid meet"
  >
    <g v-for="skill in skillShapes" :key="skill.label" class="skill-and-interest" fill="currentColor">
      <line
        :x1="skill.line.startX"
        :x2="skill.line.endX"
        :y1="skill.line.y"
        :y2="skill.line.y"
        stroke="currentColor"
        stroke-width="1"
        stroke-linecap="round"
        class="text-gray-dark dark:text-white transition-[opacity,color] duration-300 ease-in-out"
        :class="{
          'opacity-100': isSkillOrInterestActive(skill.label),
          'opacity-10': !isSkillOrInterestActive(skill.label),
        }"
      />
      <line
        :x1="skill.connector.x1"
        :y1="skill.connector.y1"
        :x2="skill.connector.x2"
        :y2="skill.connector.y2"
        stroke="currentColor"
        stroke-width="1"
        stroke-linecap="round"
        class="text-gray-dark dark:text-white transition-[opacity,color] duration-300 ease-in-out"
        :class="{
          'opacity-100': isSkillOrInterestActive(skill.label),
          'opacity-10': !isSkillOrInterestActive(skill.label),
        }"
      />
      <text
        :x="skill.x"
        :y="skill.y"
        :font-size="14"
        class="ibm font-thin text-gray-dark dark:text-white transition-[opacity,color] duration-300 ease-in-out"
        :class="{
          'opacity-100': isSkillOrInterestActive(skill.label),
          'opacity-10': !isSkillOrInterestActive(skill.label),
        }"
        text-anchor="middle"
        dominant-baseline="middle"
      >
        {{ skill.label }}
      </text>
    </g>
  </svg>
</template>

<script lang="ts" setup generic="T extends Record<string, any>">
import { computed } from 'vue'
import { RELATED_TO, skillsAndInterestsPerCategory } from '../SkillsAndInterests.constants'
import { clamp } from 'three/src/math/MathUtils.js'

const { activeTopic } = defineProps<{
  activeTopic: number | null
}>()

const flatSkillsAndInterests = new Set([
  ...skillsAndInterestsPerCategory[RELATED_TO.ART],
  ...skillsAndInterestsPerCategory[RELATED_TO.NATURE],
  ...skillsAndInterestsPerCategory[RELATED_TO.TECHNOLOGY],
])

type PositionedSkillOrInterest = {
  label: string
  x: number
  y: number
}

type SkillShape = PositionedSkillOrInterest & {
  line: {
    startX: number
    endX: number
    y: number
  }
  connector: {
    x1: number
    y1: number
    x2: number
    y2: number
  }
}

const VIEWBOX = {
  width: 800,
  height: 600,
} as const

const CENTER = {
  x: VIEWBOX.width / 2,
  y: VIEWBOX.height / 2,
} as const

const HORIZONTAL_OFFSET = 10
const AVERAGE_CHAR_WIDTH = 7
const EXTRA_LINE_WIDTH = 10
const MIN_LINE_WIDTH = 40
const DIAGONAL_LINE_LENGTH = 60
const LCG_MODULUS = 2147483647
const LCG_MULTIPLIER = 16807

const positionedSkillsAndInterests = useState<PositionedSkillOrInterest[]>('skills-and-interests-cloud-positions', () =>
  createPositions(Array.from(flatSkillsAndInterests), VIEWBOX)
)

function createPositions(labels: string[], viewBox: { width: number; height: number }): PositionedSkillOrInterest[] {
  const total = labels.length

  if (!total) {
    return []
  }

  const aspectRatio = viewBox.width / viewBox.height
  const columns = Math.max(1, Math.round(Math.sqrt(total * aspectRatio)))
  const rows = Math.max(1, Math.ceil(total / columns))
  const cellWidth = viewBox.width / columns
  const cellHeight = viewBox.height / rows

  const gridCells = Array.from({ length: rows * columns }, (_, index) => {
    const column = index % columns
    const row = Math.floor(index / columns)

    return {
      x: (column + 0.5) * cellWidth,
      y: (row + 0.5) * cellHeight,
    }
  })

  const rng = createSeededGenerator(Math.random())
  shuffleWithRng(gridCells, rng)

  return labels.map((label, index) => {
    const cell = gridCells[index]!
    const offsetX = (rng() - 0.5) * cellWidth * 0.4
    const offsetY = (rng() - 0.5) * cellHeight * 0.4

    return {
      label,
      x: clamp(cell.x + offsetX, 0, viewBox.width),
      y: clamp(cell.y + offsetY, 0, viewBox.height),
    }
  })
}

const skillShapes = computed<SkillShape[]>(() => {
  const skills = positionedSkillsAndInterests.value ?? []

  return skills.map((skill) => {
    const baseWidth = calculateLineWidth(skill.label)
    const halfWidth = baseWidth / 2

    let lineStartX = skill.x - halfWidth
    let lineEndX = skill.x + halfWidth
    let lineY = skill.y + HORIZONTAL_OFFSET

    if (lineStartX < 0) {
      lineEndX = Math.min(lineEndX - lineStartX, VIEWBOX.width)
      lineStartX = 0
    }

    if (lineEndX > VIEWBOX.width) {
      const overflow = lineEndX - VIEWBOX.width
      lineStartX = Math.max(0, lineStartX - overflow)
      lineEndX = VIEWBOX.width
    }

    lineStartX = clamp(lineStartX, 0, VIEWBOX.width)
    lineEndX = clamp(lineEndX, 0, VIEWBOX.width)
    lineY = clamp(lineY, 0, VIEWBOX.height)

    const connectorBaseX = CENTER.x >= skill.x ? lineEndX : lineStartX
    const connectorBaseY = lineY
    const vectorX = CENTER.x - connectorBaseX
    const vectorY = CENTER.y - connectorBaseY
    const distance = Math.hypot(vectorX, vectorY)

    if (distance === 0) {
      return {
        ...skill,
        line: {
          startX: lineStartX,
          endX: lineEndX,
          y: lineY,
        },
        connector: {
          x1: connectorBaseX,
          y1: connectorBaseY,
          x2: connectorBaseX,
          y2: connectorBaseY,
        },
      }
    }

    const connectorLength = Math.min(DIAGONAL_LINE_LENGTH, distance)
    const scale = connectorLength / distance

    return {
      ...skill,
      line: {
        startX: lineStartX,
        endX: lineEndX,
        y: lineY,
      },
      connector: {
        x1: connectorBaseX,
        y1: connectorBaseY,
        x2: connectorBaseX + vectorX * scale,
        y2: connectorBaseY + vectorY * scale,
      },
    }
  })
})

const isSkillOrInterestActive = (skillOrInterest: string) => {
  if (activeTopic === null) {
    return true
  }

  const relatedSkillsAndInterests =
    skillsAndInterestsPerCategory[activeTopic as keyof typeof skillsAndInterestsPerCategory]
  return relatedSkillsAndInterests.includes(skillOrInterest as any)
}

function calculateLineWidth(label: string) {
  return Math.max(MIN_LINE_WIDTH, label.length * AVERAGE_CHAR_WIDTH + EXTRA_LINE_WIDTH)
}

function createSeededGenerator(seed: number) {
  let value = Math.floor(seed * (LCG_MODULUS - 1)) + 1

  return () => {
    value = (value * LCG_MULTIPLIER) % LCG_MODULUS
    return value / LCG_MODULUS
  }
}

function shuffleWithRng<T>(items: T[], rng: () => number) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1))
    const temp = items[index]!
    items[index] = items[swapIndex]!
    items[swapIndex] = temp
  }
}
</script>
