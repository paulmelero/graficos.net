<template>
  <svg :class="svgClass" :viewBox="svgViewBox" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
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
        class="font-ibm transition-[opacity,color] duration-300 ease-in-out"
        :class="[isSkillOrInterestActive(skill.label) ? 'opacity-100' : 'opacity-10', 'text-primaryDark']"
        text-anchor="middle"
        dominant-baseline="middle"
        :filter="filterUrl"
      >
        {{ skill.label }}
      </text>
      <filter x="-.15" y="0" width="1.3" height="1" :id="filterIdValue">
        <feFlood flood-color="oklch(0.71 0.2 53.96)" result="bg" />
        <feMerge>
          <feMergeNode in="bg" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </g>
  </svg>
</template>

<script lang="ts" setup>
import { useMediaQuery } from '@vueuse/core'
import { computed, onMounted, ref, watch } from 'vue'
import { RELATED_TO, skillsAndInterestsPerCategory } from '../SkillsAndInterests.constants'
import { clamp } from 'three/src/math/MathUtils.js'

type LayoutMetrics = {
  horizontalOffset: number
  averageCharWidth: number
  extraLineWidth: number
  minLineWidth: number
  diagonalLineLength: number
  fontSize: number
  collisionPaddingX: number
  collisionPaddingY: number
}

type LayoutPreset = {
  heightMultiplier: number
  metrics: LayoutMetrics
}

type LayoutPresetOverride = {
  heightMultiplier?: number
  metrics?: Partial<LayoutMetrics>
}

type LayoutConfigOverrides = Partial<Record<'default' | 'compact', LayoutPresetOverride>>

const DEFAULT_LAYOUT_PRESETS: Record<'default' | 'compact', LayoutPreset> = {
  compact: {
    heightMultiplier: 0.85,
    metrics: {
      horizontalOffset: 10,
      averageCharWidth: 7,
      extraLineWidth: 12,
      minLineWidth: 44,
      diagonalLineLength: 56,
      fontSize: 22,
      collisionPaddingX: 28,
      collisionPaddingY: 18,
    },
  },
  default: {
    heightMultiplier: 1,
    metrics: {
      horizontalOffset: 10,
      averageCharWidth: 7,
      extraLineWidth: 10,
      minLineWidth: 40,
      diagonalLineLength: 60,
      fontSize: 14,
      collisionPaddingX: 20,
      collisionPaddingY: 12,
    },
  },
}

const LCG_MODULUS = 2147483647
const LCG_MULTIPLIER = 16807

const props = withDefaults(
  defineProps<{
    activeTopic: number | null
    viewBox: {
      width: number
      height: number
    }
    svgClass?: string
    filterId?: string
    cacheKey?: string
    layoutConfig?: LayoutConfigOverrides
    forceLayout?: 'default' | 'compact'
  }>(),
  {
    cacheKey: 'skills-and-interests-cloud-positions',
    svgClass:
      'absolute inset-x-0 top-[8vh] w-[calc(100%-2.5rem)] mx-auto h-[75vh] sm:top-[5vh] sm:h-screen z-20 pointer-events-none',
    viewBox: () => ({ width: 800, height: 600 }),
  }
)

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

const svgClass = computed(() => props.svgClass)
const filterIdValue = computed(() => props.filterId ?? 'text-bg-filter')
const filterUrl = computed(() => `url(#${filterIdValue.value})`)

const isCompactLayout = ref(false)

const layoutKey = computed<'default' | 'compact'>(() => {
  if (props.forceLayout) {
    return props.forceLayout
  }

  return isCompactLayout.value ? 'compact' : 'default'
})

const layoutPreset = computed<LayoutPreset>(() => {
  const key = layoutKey.value
  const defaults = DEFAULT_LAYOUT_PRESETS[key]
  const overrides = props.layoutConfig?.[key] ?? {}
  const metricsOverrides = overrides.metrics ?? {}

  return {
    heightMultiplier: overrides.heightMultiplier ?? defaults.heightMultiplier,
    metrics: {
      ...defaults.metrics,
      ...metricsOverrides,
    },
  }
})

const layoutMetrics = computed(() => layoutPreset.value.metrics)

const baseViewBox = computed(() => {
  return {
    width: props.viewBox.width,
    height: props.viewBox.height,
  }
})

const currentViewBox = computed(() => {
  const base = baseViewBox.value
  const heightMultiplier = layoutPreset.value.heightMultiplier

  return {
    width: base.width,
    height: Math.round(base.height * heightMultiplier),
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
>(props.cacheKey, () => ({}))

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
  const compactQuery = !props.forceLayout ? useMediaQuery('(max-width: 768px)') : null

  onMounted(() => {
    if (compactQuery) {
      isCompactLayout.value = compactQuery.value

      watch(compactQuery, (value) => {
        isCompactLayout.value = value
        ensurePositions()
      })
    }

    ensurePositions()

    watch(currentViewBox, ensurePositions, { deep: true })
    watch(layoutKey, ensurePositions)
    watch(
      () => props.layoutConfig,
      () => ensurePositions(),
      { deep: true }
    )
  })
}

const positionedSkillsAndInterests = computed(() => {
  const key = layoutKey.value
  return positionsCache.value[key]?.items ?? []
})

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

function createPositions(
  labels: string[],
  viewBox: { width: number; height: number },
  metrics: LayoutMetrics
): PositionedSkillOrInterest[] {
  const total = labels.length

  if (!total) {
    return []
  }

  const labelledEntries = labels.map((label, index) => ({ label, index }))
  const placementOrder = [...labelledEntries].sort((a, b) => b.label.length - a.label.length)
  const results: PositionedSkillOrInterest[] = new Array(total)

  const areaPerItem = (viewBox.width * viewBox.height) / total
  const baseSpacing = Math.sqrt(areaPerItem)
  const jitterRangeX = Math.min((baseSpacing + metrics.collisionPaddingX * 2) * 0.9, viewBox.width * 0.35)
  const jitterRangeY = Math.min((baseSpacing + metrics.collisionPaddingY * 2) * 0.9, viewBox.height * 0.35)

  const rng = createSeededGenerator(Math.random())
  const placed: Array<{ x: number; y: number; halfWidth: number; halfHeight: number }> = []

  placementOrder.forEach(({ label, index: originalIndex }, placementIndex) => {
    const approxWidth = Math.max(metrics.minLineWidth, label.length * metrics.averageCharWidth + metrics.extraLineWidth)
    const approxHeight = metrics.fontSize
    const halfWidth = approxWidth / 2 + metrics.collisionPaddingX
    const halfHeight = approxHeight / 2 + metrics.collisionPaddingY
    const maxAttempts = 18

    let attempt = 0
    let position: PositionedSkillOrInterest | null = null

    while (attempt < maxAttempts && !position) {
      const baseX = halton(placementIndex + 1, 2) * viewBox.width
      const baseY = halton(placementIndex + 1, 3) * viewBox.height
      const spreadFactor = 1 + attempt * 0.35
      const offsetX = (rng() - 0.5) * jitterRangeX * spreadFactor
      const offsetY = (rng() - 0.5) * jitterRangeY * spreadFactor
      const x = clamp(baseX + offsetX, halfWidth, viewBox.width - halfWidth)
      const y = clamp(baseY + offsetY, halfHeight, viewBox.height - halfHeight)

      const overlaps = placed.some((item) => checkBoxOverlap(item, { x, y, halfWidth, halfHeight }))

      if (!overlaps) {
        position = { label, x, y }
        placed.push({ x, y, halfWidth, halfHeight })
        results[originalIndex] = position
      }

      attempt += 1
    }

    if (!position) {
      const fallbackX = clamp(halton(originalIndex + 1, 5) * viewBox.width, halfWidth, viewBox.width - halfWidth)
      const fallbackY = clamp(halton(originalIndex + 1, 7) * viewBox.height, halfHeight, viewBox.height - halfHeight)
      const overlaps = placed.some((item) =>
        checkBoxOverlap(item, { x: fallbackX, y: fallbackY, halfWidth, halfHeight })
      )

      if (!overlaps) {
        placed.push({ x: fallbackX, y: fallbackY, halfWidth, halfHeight })
      }

      results[originalIndex] = { label, x: fallbackX, y: fallbackY }
    }
  })

  return results.filter(Boolean) as PositionedSkillOrInterest[]
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

function checkBoxOverlap(
  a: { x: number; y: number; halfWidth: number; halfHeight: number },
  b: { x: number; y: number; halfWidth: number; halfHeight: number }
) {
  const overlapX = Math.abs(a.x - b.x) < a.halfWidth + b.halfWidth
  const overlapY = Math.abs(a.y - b.y) < a.halfHeight + b.halfHeight

  return overlapX && overlapY
}

function halton(index: number, base: number) {
  let result = 0
  let f = 1 / base
  let i = index

  while (i > 0) {
    result += f * (i % base)
    i = Math.floor(i / base)
    f /= base
  }

  return result
}
</script>
