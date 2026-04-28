<template>
  <svg :class="props.svgClass" :viewBox="svgViewBox" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
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
        ref="textRefs"
        :data-label="skill.label"
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
import { computed, nextTick, onMounted, ref, watch } from 'vue'
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
  verticalJitter: number
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

const GRID_COLS = 24
const GRID_EXPANSION_ROWS = 4
const MAX_GRID_EXPANSIONS = 5

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
      verticalJitter: 14,
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
      verticalJitter: 0,
    },
  },
}

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
    seed?: number
  }>(),
  {
    cacheKey: 'skills-and-interests-cloud-positions',
    svgClass:
      'absolute inset-x-0 top-[8vh] w-[calc(100%-2.5rem)] mx-auto h-[75vh] sm:top-[5vh] sm:h-screen z-20 pointer-events-none',
    viewBox: () => ({ width: 800, height: 600 }),
    seed: 122333,
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

const filterIdValue = computed(() => props.filterId ?? 'text-bg-filter')
const filterUrl = computed(() => `url(#${filterIdValue.value})`)

const isCompactLayout = ref(false)
const textRefs = ref<SVGTextElement[]>([])
const realWidths = ref<Map<string, number>>(new Map())

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

const positionsCache = useState<
  Record<
    string,
    {
      viewBox: {
        width: number
        height: number
      }
      gridHeight: number
      items: PositionedSkillOrInterest[]
      seed: number
      measured?: boolean
    }
  >
>(props.cacheKey, () => ({}))

const computedGridHeight = computed(() => {
  const key = layoutKey.value
  return positionsCache.value[key]?.gridHeight ?? currentViewBox.value.height
})

const svgViewBox = computed(() => {
  const width = currentViewBox.value.width
  const height = computedGridHeight.value
  return `0 0 ${width} ${height}`
})

const fontSize = computed(() => layoutMetrics.value.fontSize)

const ensurePositions = () => {
  const key = layoutKey.value
  const viewBox = currentViewBox.value
  const metrics = layoutMetrics.value
  const seed = props.seed

  const cached = positionsCache.value[key]

  const needsUpdate =
    !cached ||
    cached.viewBox.width !== viewBox.width ||
    cached.viewBox.height !== viewBox.height ||
    cached.seed !== seed ||
    (realWidths.value.size > 0 && !cached.measured)

  if (needsUpdate) {
    const layout = createPositions(Array.from(flatSkillsAndInterests), viewBox, metrics, seed, realWidths.value)

    positionsCache.value = {
      ...positionsCache.value,
      [key]: {
        viewBox,
        seed,
        measured: realWidths.value.size > 0,
        items: layout.items,
        gridHeight: layout.gridHeight,
      },
    }
  }
}

ensurePositions()

if (import.meta.client) {
  const compactQuery = !props.forceLayout ? useMediaQuery('(max-width: 768px)') : null

  const measureAndRefine = () => {
    nextTick(() => {
      const cellWidth = Math.floor(currentViewBox.value.width / GRID_COLS)
      const significantDiff = cellWidth * 0.5

      let changed = false
      textRefs.value.forEach((el) => {
        const label = el.dataset.label
        if (!label) return

        const bbox = el.getBBox()
        const current = realWidths.value.get(label)

        if (!current || Math.abs(current - bbox.width) > significantDiff) {
          realWidths.value.set(label, bbox.width)
          changed = true
        }
      })

      if (changed) {
        ensurePositions()
      }
    })
  }

  onMounted(() => {
    if (compactQuery) {
      isCompactLayout.value = compactQuery.value

      watch(compactQuery, (value) => {
        isCompactLayout.value = value
        ensurePositions()
      })
    }

    ensurePositions()
    measureAndRefine()

    watch(currentViewBox, ensurePositions, { deep: true })
    watch(layoutKey, ensurePositions)
    watch(
      () => props.layoutConfig,
      () => ensurePositions(),
      { deep: true }
    )

    watch(positionedSkillsAndInterests, measureAndRefine, { flush: 'post' })
  })
}

const positionedSkillsAndInterests = computed(() => {
  const key = layoutKey.value
  return positionsCache.value[key]?.items ?? []
})

const skillShapes = computed<SkillShape[]>(() => {
  const skills = positionedSkillsAndInterests.value ?? []
  const { diagonalLineLength, horizontalOffset } = layoutMetrics.value

  // Gravity center is the original (unexpanded) viewport center, not the grown grid's,
  // so connectors point toward where the eye expects the visual middle.
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

    const layoutWidth = currentViewBox.value.width
    const layoutHeight = computedGridHeight.value

    if (lineStartX < 0) {
      lineEndX = Math.min(lineEndX - lineStartX, layoutWidth)
      lineStartX = 0
    }

    if (lineEndX > layoutWidth) {
      const overflow = lineEndX - layoutWidth
      lineStartX = Math.max(0, lineStartX - overflow)
      lineEndX = layoutWidth
    }

    lineStartX = clamp(lineStartX, 0, layoutWidth)
    lineEndX = clamp(lineEndX, 0, layoutWidth)
    lineY = clamp(lineY, 0, layoutHeight)

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
  if (realWidths.value.has(label)) {
    const { extraLineWidth } = layoutMetrics.value
    return realWidths.value.get(label)! + extraLineWidth
  }

  const { averageCharWidth, extraLineWidth, minLineWidth } = layoutMetrics.value
  return Math.max(minLineWidth, label.length * averageCharWidth + extraLineWidth)
}

function createPositions(
  labels: string[],
  viewBox: { width: number; height: number },
  metrics: LayoutMetrics,
  seed: number,
  measuredWidths: Map<string, number>
): { items: PositionedSkillOrInterest[]; gridHeight: number } {
  if (!labels.length) return { items: [], gridHeight: viewBox.height }

  const rng = mulberry32(seed)
  const cellWidth = viewBox.width / GRID_COLS
  const cellHeight = metrics.fontSize + metrics.collisionPaddingY * 2

  let currentRows = Math.max(Math.ceil(viewBox.height / cellHeight), Math.ceil(labels.length / (GRID_COLS * 0.6)))
  let grid = new Uint8Array(currentRows * GRID_COLS)

  const items = labels.map((label) => {
    const width = measuredWidths.get(label) ?? Math.max(metrics.minLineWidth, label.length * metrics.averageCharWidth)
    const collisionWidth = width + metrics.extraLineWidth + metrics.collisionPaddingX * 2
    const collisionHeight = metrics.fontSize + metrics.collisionPaddingY * 2
    const colsNeeded = Math.max(1, Math.ceil(collisionWidth / cellWidth))
    const rowsNeeded = Math.max(1, Math.ceil(collisionHeight / cellHeight))

    return { label, colsNeeded, rowsNeeded }
  })

  // First-Fit Decreasing: place largest items first so big labels claim slots
  // before small ones fragment the grid.
  items.sort((a, b) => b.colsNeeded * b.rowsNeeded - a.colsNeeded * a.rowsNeeded)

  // Rank each cell as `radialDistance * 0.3 + rng * 0.7`. The radial term gives
  // a mild pull toward center so the cloud reads as a single mass; the dominant
  // random term spreads items toward the edges instead of clumping the middle.
  const generateRankedCells = (rows: number) => {
    const list = []
    const centerC = (GRID_COLS - 1) / 2
    const centerR = (rows - 1) / 2
    const maxDist = Math.sqrt(centerR * centerR + centerC * centerC) || 1

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        const dr = r - centerR
        const dc = c - centerC
        const normDist = Math.sqrt(dr * dr + dc * dc) / maxDist
        list.push({ r, c, rank: normDist * 0.3 + rng() * 0.7 })
      }
    }
    list.sort((a, b) => a.rank - b.rank)
    return list
  }

  let rankedCells = generateRankedCells(currentRows)
  const results: PositionedSkillOrInterest[] = []

  const tryPlace = (item: { label: string; colsNeeded: number; rowsNeeded: number }) => {
    for (const { r, c } of rankedCells) {
      if (c + item.colsNeeded > GRID_COLS) continue
      if (r + item.rowsNeeded > currentRows) continue

      let overlaps = false
      for (let y = 0; y < item.rowsNeeded && !overlaps; y++) {
        const rowOffset = (r + y) * GRID_COLS
        for (let x = 0; x < item.colsNeeded; x++) {
          if (grid[rowOffset + c + x] === 1) {
            overlaps = true
            break
          }
        }
      }
      if (overlaps) continue

      for (let y = 0; y < item.rowsNeeded; y++) {
        const rowOffset = (r + y) * GRID_COLS
        for (let x = 0; x < item.colsNeeded; x++) {
          grid[rowOffset + c + x] = 1
        }
      }

      // Vertical jitter staggers labels off the rigid row baseline so adjacent
      // cells don't share an exact y — without it underlines on the same row
      // visually merge into a single line. Capped to half the slack between
      // the glyph and the cell, so the jitter cannot push text into a neighbor.
      const maxJitter = Math.min(metrics.verticalJitter, (cellHeight - metrics.fontSize) / 2)
      const jitterY = maxJitter > 0 ? (rng() - 0.5) * 2 * maxJitter : 0

      results.push({
        label: item.label,
        x: c * cellWidth + (item.colsNeeded * cellWidth) / 2,
        y: r * cellHeight + (item.rowsNeeded * cellHeight) / 2 + jitterY,
      })
      return true
    }
    return false
  }

  for (const item of items) {
    let placed = tryPlace(item)
    for (let attempt = 0; !placed && attempt < MAX_GRID_EXPANSIONS; attempt++) {
      const newRows = currentRows + GRID_EXPANSION_ROWS
      const newGrid = new Uint8Array(newRows * GRID_COLS)
      newGrid.set(grid)
      grid = newGrid
      currentRows = newRows
      rankedCells = generateRankedCells(currentRows)
      placed = tryPlace(item)
    }

    if (!placed && import.meta.dev) {
      console.warn(`[WordsCloud] Could not place "${item.label}" even after expansion.`)
    }
  }

  return {
    items: results,
    gridHeight: currentRows * cellHeight,
  }
}

function mulberry32(seed: number) {
  let a = seed
  return () => {
    let t = (a += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
</script>
