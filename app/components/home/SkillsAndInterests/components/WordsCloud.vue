<template>
  <svg
    class="absolute inset-x-0 top-[8vh] w-full h-[75vh] sm:top-[5vh] sm:h-screen z-20 pointer-events-none"
    :viewBox="svgViewBox"
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
        :font-size="fontSize"
        class="font-ibm font-thin text-gray-dark dark:text-white transition-[opacity,color] duration-300 ease-in-out"
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
import { useMediaQuery } from '@vueuse/core'
import { computed, onMounted, ref, watch } from 'vue'
import { RELATED_TO, skillsAndInterestsPerCategory } from '../SkillsAndInterests.constants'
import { clamp } from 'three/src/math/MathUtils.js'

const props = defineProps<{
  activeTopic: number | null
  viewBox?: {
    width: number
    height: number
  }
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

type LayoutMetrics = {
  horizontalOffset: number
  averageCharWidth: number
  extraLineWidth: number
  minLineWidth: number
  diagonalLineLength: number
  fontSize: number
}

// https://en.wikipedia.org/wiki/Linear_congruential_generator
const LCG_MODULUS = 2147483647
const LCG_MULTIPLIER = 16807

const DEFAULT_VIEWBOX = {
  width: 800,
  height: 600,
} as const

// Boolean result of the media query
const isCompactLayout = ref(false)

const layoutKey = computed(() => (isCompactLayout.value ? 'compact' : 'default'))

const baseViewBox = computed(() => {
  if (!props.viewBox) {
    return { ...DEFAULT_VIEWBOX }
  }

  return {
    width: props.viewBox.width,
    height: props.viewBox.height,
  }
})

const currentViewBox = computed(() => {
  const base = baseViewBox.value

  if (layoutKey.value === 'compact') {
    return {
      width: base.width,
      height: Math.round(base.height * 0.85),
    }
  }

  return {
    width: base.width,
    height: base.height,
  }
})

const layoutMetrics = computed(() => {
  if (layoutKey.value === 'compact') {
    return {
      horizontalOffset: 10,
      averageCharWidth: 7,
      extraLineWidth: 12,
      minLineWidth: 44,
      diagonalLineLength: 56,
      fontSize: 22,
    }
  }

  return {
    horizontalOffset: 10,
    averageCharWidth: 7,
    extraLineWidth: 10,
    minLineWidth: 40,
    diagonalLineLength: 60,
    fontSize: 14,
  }
})

const svgViewBox = computed(() => {
  const viewBox = currentViewBox.value
  return `0 0 ${viewBox.width} ${viewBox.height}`
})

const fontSize = computed(() => layoutMetrics.value.fontSize)

const positionsCache = useState<
  Record<
    string,
    {
      viewBox: {
        width: number
        height: number
      }
      items: PositionedSkillOrInterest[]
    }
  >
>('skills-and-interests-cloud-positions', () => ({}))

const ensurePositions = () => {
  const key = layoutKey.value
  const viewBox = currentViewBox.value
  const metrics = layoutMetrics.value
  const cached = positionsCache.value[key]

  if (!cached || cached.viewBox.width !== viewBox.width || cached.viewBox.height !== viewBox.height) {
    positionsCache.value = {
      ...positionsCache.value,
      [key]: {
        viewBox,
        items: createPositions(Array.from(flatSkillsAndInterests), viewBox, metrics),
      },
    }
  }
}

ensurePositions()

if (import.meta.client) {
  const compactQuery = useMediaQuery('(max-width: 768px)')

  onMounted(() => {
    isCompactLayout.value = compactQuery.value
    ensurePositions()

    watch(compactQuery, (value) => {
      isCompactLayout.value = value
      ensurePositions()
    })

    watch(currentViewBox, ensurePositions)
    watch(layoutKey, ensurePositions)
  })
}

const positionedSkillsAndInterests = computed(() => {
  const key = layoutKey.value
  return positionsCache.value[key]?.items ?? []
})

function createPositions(
  labels: string[],
  viewBox: { width: number; height: number },
  metrics: LayoutMetrics
): PositionedSkillOrInterest[] {
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

  const placed: Array<{ x: number; y: number; halfWidth: number; halfHeight: number }> = []
  const positions: PositionedSkillOrInterest[] = []

  labels.forEach((label, index) => {
    const cell = gridCells[index]!
    const approxWidth = Math.max(label.length * metrics.averageCharWidth, metrics.minLineWidth * 0.6)
    const halfWidth = approxWidth / 2 + Math.max(4, metrics.fontSize * 0.15)
    const halfHeight = metrics.fontSize / 2 + Math.max(2, metrics.fontSize * 0.1)
    const maxAttempts = 12

    let attempt = 0
    let position: PositionedSkillOrInterest | null = null

    // Try to find a non-overlapping position within the cell
    // up to maxAttempts times
    while (attempt < maxAttempts && !position) {
      const offsetX = (rng() - 0.5) * cellWidth * 0.4
      const offsetY = (rng() - 0.5) * cellHeight * 0.4
      const x = clamp(cell.x + offsetX, halfWidth, viewBox.width - halfWidth)
      const y = clamp(cell.y + offsetY, halfHeight, viewBox.height - halfHeight)

      const overlaps = placed.some((item) => checkBoxOverlap(item, { x, y, halfWidth, halfHeight }))

      if (!overlaps) {
        position = { label, x, y }
        placed.push({ x, y, halfWidth, halfHeight })
        positions.push(position)
      }

      attempt += 1
    }

    if (!position) {
      const fallbackX = clamp(cell.x, halfWidth, viewBox.width - halfWidth)
      const fallbackY = clamp(cell.y, halfHeight, viewBox.height - halfHeight)
      const overlaps = placed.some((item) =>
        checkBoxOverlap(item, { x: fallbackX, y: fallbackY, halfWidth, halfHeight })
      )

      if (!overlaps) {
        placed.push({ x: fallbackX, y: fallbackY, halfWidth, halfHeight })
      }

      positions.push({ label, x: fallbackX, y: fallbackY })
    }
  })

  return positions
}

const skillShapes = computed<SkillShape[]>(() => {
  const skills = positionedSkillsAndInterests.value ?? []
  const { diagonalLineLength, horizontalOffset } = layoutMetrics.value
  const center = {
    x: currentViewBox.value.width / 2,
    y: currentViewBox.value.height / 2,
  }

  return skills.map((skill) => {
    const baseWidth = calculateLineWidth(skill.label)
    const halfWidth = baseWidth / 2

    let lineStartX = skill.x - halfWidth
    let lineEndX = skill.x + halfWidth
    let lineY = skill.y + horizontalOffset

    if (lineStartX < 0) {
      lineEndX = Math.min(lineEndX - lineStartX, currentViewBox.value.width)
      lineStartX = 0
    }

    if (lineEndX > currentViewBox.value.width) {
      const overflow = lineEndX - currentViewBox.value.width
      lineStartX = Math.max(0, lineStartX - overflow)
      lineEndX = currentViewBox.value.width
    }

    lineStartX = clamp(lineStartX, 0, currentViewBox.value.width)
    lineEndX = clamp(lineEndX, 0, currentViewBox.value.width)
    lineY = clamp(lineY, 0, currentViewBox.value.height)

    const connectorBaseX = center.x >= skill.x ? lineEndX : lineStartX
    const connectorBaseY = lineY
    const vectorX = center.x - connectorBaseX
    const vectorY = center.y - connectorBaseY
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

    const connectorLength = Math.min(diagonalLineLength, distance)
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
  const activeTopic = props.activeTopic

  if (activeTopic === null) {
    return true
  }

  const relatedSkillsAndInterests =
    skillsAndInterestsPerCategory[activeTopic as keyof typeof skillsAndInterestsPerCategory]
  return relatedSkillsAndInterests.includes(skillOrInterest as any)
}

function calculateLineWidth(label: string) {
  const { averageCharWidth, extraLineWidth, minLineWidth } = layoutMetrics.value
  return Math.max(minLineWidth, label.length * averageCharWidth + extraLineWidth)
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
/**
 * Preventing collisions between two boxes
 */
function checkBoxOverlap(
  a: { x: number; y: number; halfWidth: number; halfHeight: number },
  b: { x: number; y: number; halfWidth: number; halfHeight: number }
) {
  const overlapX = Math.abs(a.x - b.x) < a.halfWidth + b.halfWidth
  const overlapY = Math.abs(a.y - b.y) < a.halfHeight + b.halfHeight

  return overlapX && overlapY
}
</script>
