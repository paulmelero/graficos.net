---
lang: EN
title: 'The Algorithm Behind Procedural Games Like Minecraft — Applied to UI Development'
date: 2026-04-29
thumbnail: /images/uploads/grid-desktop.png
tags:
  - Algorithm
  - SVG
  - Computer Science
  - Computer Graphics
  - Procedural Generation
  - Game Development
  - Web Development
  - Mathematics
  - TypeScript
description: "How a grid, a seeded PRNG, and a 50-year-old bin-packing heuristic power both Minecraft's infinite worlds and a simple SVG word cloud — and why that's not a coincidence."
summary: "How a grid, a seeded PRNG, and a 50-year-old bin-packing heuristic power both Minecraft's infinite worlds and a simple SVG word cloud — and why that's not a coincidence."
---

## What do Minecraft's infinite worlds and the word cloud on this homepage have in common?

More than you'd think. They both rely on the same fundamental recipe: **a grid of discrete cells, a seeded pseudo-random number generator, and the guarantee that each cell can only be claimed by one "occupant".**

In Minecraft, a 64-bit seed initializes a PRNG (pseudo-random number generator) that feeds into layers of [Perlin noise](https://en.wikipedia.org/wiki/Perlin_noise) — the gradient noise algorithm Ken Perlin invented in 1983. The noise function generates terrain heights, biome boundaries, cave systems, all deterministically. Same seed, same world, every time. In my word cloud, a 32-bit seed drives label placement across an SVG viewport. Same seed, same layout, meaning the same words are placed in the same positions on server and client. The scale is comically different. The principle is identical.

This post is about how I (with the help of some LLMs, of course) built that word cloud — and the surprising amount of computer science history packed into ~150 lines of TypeScript.

## What went wrong before

Previous versions of this component used a brute-force approach: scatter labels at random positions, then check each new label against every already-placed one for overlap. When a collision was detected, retry up to 12 times with a random offset. If all retries failed, give up and place the label anyway — accepting the overlap.

The [code looked like this](https://github.com/paulmelero/graficos.net/blob/a2c7f4456c7b13a26594f1e7ae5ec601a2141206/app/components/home/SkillsAndInterests/components/WordsCloud.vue#L260-L310):

```ts
while (attempt < maxAttempts && !position) {
  const offsetX = (rng() - 0.5) * cellWidth * 0.4
  const offsetY = (rng() - 0.5) * cellHeight * 0.4
  const x = clamp(cell.x + offsetX, halfWidth, viewBox.width - halfWidth)
  const y = clamp(cell.y + offsetY, halfHeight, viewBox.height - halfHeight)

  // O(n) — check against EVERY placed label
  const overlaps = placed.some((item) => checkBoxOverlap(item, { x, y, halfWidth, halfHeight }))

  if (!overlaps) {
    position = { label, x, y }
    placed.push({ x, y, halfWidth, halfHeight })
  }

  attempt += 1
}

// All retries exhausted — place it anyway, overlap or not
if (!position) {
  positions.push({ label, x: fallbackX, y: fallbackY })
}
```

Two problems. First, overlap detection was **O(n)** per attempt — each new label was checked against the full list of already-placed labels. With 24 labels and up to 12 retries each, that's up to 288 × 24 = 6,912 bounding-box comparisons. Second, and worse, **it couldn't guarantee overlap-free placement**. After 12 failed attempts, labels were placed regardless. Overlaps happened, especially on narrow viewports where space was tight.

Several [iterations](https://github.com/paulmelero/graficos.net/commit/19e623bff1c09199e2f1958b214e0fd6493a424e) tried to fix edge cases — different retry strategies, adjusted padding, responsive tweaks — but the fundamental approach was **flawed**. You can't guarantee non-overlap through "retry-and-hope".

## A matrix of cells: the grid

The journey to the fix led me to discover a lot of computer science history and interesting math concepts. Then I found out that those concepts were used in most procedural games and it has other common applications you use everyday.

The viewport is divided into a **24-column matrix of cells**:

```ts
const GRID_COLS = 24
const cellWidth = viewBox.width / GRID_COLS
const cellHeight = metrics.fontSize + metrics.collisionPaddingY * 2
```

Each label occupies exactly **one row** but spans as many **columns** as its text width requires — a short word like `"Maths"` might take 3 columns, while `"Open Source Contribution"` might take 8.

The grid is stored as a flat `Uint8Array` — `0` for free, `1` for occupied to make it as space-efficient as possible:

```ts
let grid = new Uint8Array(currentRows * GRID_COLS)
```

When a label claims its cells, those cells are marked as occupied. Checking whether a label fits is a tight loop:

```ts
for (let y = 0; y < item.rowsNeeded && !overlaps; y++) {
  const rowOffset = (r + y) * GRID_COLS
  for (let x = 0; x < item.colsNeeded; x++) {
    if (grid[rowOffset + c + x] === 1) {
      overlaps = true
      break
    }
  }
}
```

No `getBoundingClientRect` calculations. No nearest neighbor lookups. Just array lookups — **O(1)** per cell.

This is the same data structure that roboticists Hans Moravec and Alberto Elfes [introduced in 1985](https://www.ri.cmu.edu/publications/high-resolution-maps-from-wide-angle-sonar/) as **occupancy grids**: split an environment into cells, mark each as free or occupied. What works for a robot navigating a room works for labels navigating an SVG.

<figure>
  <img src="/images/uploads/grid-desktop.png" alt="Grid overlay on the desktop word cloud, showing the 24-column cell structure" loading="lazy">
  <figcaption>
    This image shows a (debug-only) grid overlay on the desktop word cloud, showing the 24-column cell structure.
  </figcaption>
</figure>

## How cells are ranked: 🔊 noise, 🌱 seeds, and 🎮 Minecraft

The grid solves _collision detection_, but you still need a strategy for _where_ to place each label. Scanning left-to-right, top-to-bottom would pack labels into the top-left corner. You need something that looks random but is actually deterministic.

Minecraft, and similar procedural games, face the same problem — at a vastly larger scale. A world seed initializes a PRNG that feeds into layers of [Perlin noise](https://en.wikipedia.org/wiki/Perlin_noise). That noise function generates terrain heights, biome boundaries, cave systems, all **deterministically**. Same seed, same world, every time. Instead of storing every single square meter of the world, they store a seed and a PRNG that generates the world on the fly. If the PRNG is seeded with the same seed, the world will be the same every time.

The word cloud component uses a simpler version of the same idea. 💡 A [Mulberry32](https://gist.github.com/tommyettinger/46a874533244883189143505d203312c) PRNG (by Tommy Ettinger) generates a deterministic sequence from a seed:

```ts
function mulberry32(seed: number) {
  let a = seed
  return () => {
    let t = (a += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
```

## Even distribution: why random is not enough

But which cell should each label go to? If you rank cells by a purely random value, the result skews toward the edges — there are simply **more cells far from center than near it**. And I wanted them all to have this focal point effect. This is the same problem as [uniformly sampling points inside a circle](https://en.wikipedia.org/wiki/Disk_point_picking): if you pick a random angle and a random radius, points cluster near the center because **the area grows with r²**. Here the problem is inverted — in a rectangular grid, the periphery has more cells at each distance band, so pure randomness produces an edge-heavy cloud with a sparse center.

The classic fix for disk sampling (as I've came to learn) is to weight by the **square root of the radius** in the case of a circle. The word cloud uses a simpler blend — each cell gets a **rank** that mixes a small (30%) radial bias with a dominant (70%) random term extracted from the PRNG:

```ts
const rank = normDist * 0.3 + rng() * 0.7
```

The 30% radial term gives center cells a slight advantage, counteracting their numerical disadvantage. The 70% random term prevents a dense bullseye. The result is an even spread that reads as a single visual mass without obviously clustering anywhere. Cells are sorted by rank, and labels are placed largest first. This is something an LLM suggested after I explained the problem to it, since it's a common problem in "packing algorithms".

```ts
items.sort((a, b) => b.colsNeeded * b.rowsNeeded - a.colsNeeded * a.rowsNeeded)
```

Big labels claim cells while the grid is mostly empty. Small labels fill the gaps → **No retries needed**. 👍🏽

## Seeding for SSR-friendliness

This matters beyond aesthetics. JavaScript's `Math.random()` can't accept a seed — it's automatically seeded by the runtime. In a server-side rendering framework like Nuxt, the server renders the HTML first, then the client hydrates it. If both call `Math.random()`, they produce different sequences, and the layout shifts on hydration. I could have used [`useId`](https://vuejs.org/api/composition-api-helpers.html#useid) to generate a unique seed for each client, but I opted to explore a solution that didn't tied the logic of something related to graphics to the framework itself.

A seeded PRNG eliminates the hydration mismatch problem entirely. Same seed on server and client, same sequence, same layout. Zero hydration mismatch, zero layout shift. The word cloud is effectively a **pure function** from seed to SVG.

This trick, often used in game development to save memory and compute resources, is used to generate graphics that feel random but are actually deterministic (even during the hydration process) on the Web. How cool is that?

## Jitter: adding a bit of randomness to the rigid layout

With labels placed in grid cells, the layout is overlap-free but rigid. Labels on the same row share an exact y-coordinate, and their decorative underlines merge into a visible horizontal band.

The fix is **jitter**: a small random vertical offset within each cell's bounds.

```ts
const maxJitter = Math.min(metrics.verticalJitter, (cellHeight - metrics.fontSize) / 2)
const jitterY = maxJitter > 0 ? (rng() - 0.5) * 2 * maxJitter : 0
```

The offset is capped to half the slack between the glyph and the cell edge. Since each label _owns_ its cells, any displacement within those bounds **cannot** perturb a neighbor. You get the warmth of randomness with zero risk of overlap.

![Grid overlay on the mobile word cloud, showing vertical jitter within cells](/images/uploads/grid-mobile.png)

## Dodecahedron, videos, and labels category

In case you didn't notice, the word cloud is not the only thing in this section. There's a Three.js-powered dodecahedron and a video (actually three videos) playing over it.

I think that alone deserves a future post. But I also wanted to mention that, to me this sections is more personal than it seems. The three videos and the three labels categories are a reflection of my interests and hobbies:

- Video 1: "Art"
- Video 2: "Nature"
- Video 3: "Programming"

Some of the labels are used in 1 or 2 categories, some are used in all three.

The dodecahedron for me, represents a the poly-facetted individual that I consider myself to be. And the implemeentation of the word cloud is a combination of 2 of my passions and interests: web development and mathematics.

## Why it works: determinism inside stochasticity

> Why can something randomly placed be _guaranteed_ not to overlap with its neighbors?

Thanks to the grid! Each cell is either free or occupied. A label claims its cells atomically. No two labels can share a cell. The randomness only determines _which_ free cell is chosen — not whether collision might occur.

This is the same principle behind seemingly unrelated ideas.

- **Hash maps** guarantee O(1) lookup because each key hashes to exactly one bucket.
- **Mutex locks** guarantee thread safety because only one thread can hold the lock.
- **Cellular automata** produce complex emergent behavior from simple rules applied to a grid of cells with exclusive state.

In all cases, the power comes from **discretization**: continuous, messy reality is projected onto a finite set of slots, and slot ownership is non-negotiable. We go from a continuous space to a discrete one, from Real Numbers to Integers.

There's something philosophically satisfying about it too. We tend to think of "random" and "guaranteed" as opposites. But a seeded PRNG is _deterministic_ — it's a pure function from seed to sequence. What _looks_ stochastic or "random" is actually as predictable as a hardcoded sequence. The word cloud's layout feels organic and alive, but it was fully _determined_ the moment the seed was chosen. Every label's position was already decided before the first pixel was painted on screen.

When it comes to the intersection of randomness and determinism, I can't help to get a bit philosophical!

Procedural generated worlds, like Minecraft's, feel infinite and surprising. In a sense, they are. But they are also deterministic consequences of a simple number or a repeatable experiment.

The word cloud is around 150 lines of TypeScript. No physics engine, no iterative solver, no external library. Simpler than the [previous version](https://github.com/paulmelero/graficos.net/commit/a2c7f4456c7b13a26594f1e7ae5ec601a2141206) that couldn't guarantee overlap prevention.

Aand I'm just super proud of it because of how simplistic it is, providing a SSR-friendly and performant solution that is as solid as a rock, and also I'm proud of having learned so much while building it. So much so, that I wanted to share it with you. 💚
