import { describe, expect, it } from 'vitest'

import { getFeaturedCollections, groupCollectionsByCategory, isCollectionCategory } from './collections'

const items = [
  { category: 'fonts' as const, featured: true, title: 'A' },
  { category: 'fonts' as const, featured: true, title: 'B' },
  { category: 'web-games' as const, featured: false, title: 'C' },
  { category: 'websites' as const, featured: true, title: 'D' },
]

describe('collections config', () => {
  it('groups collections in category order and drops empty categories', () => {
    expect(groupCollectionsByCategory(items).map((group) => group.slug)).toEqual(['fonts', 'websites', 'web-games'])
  })

  it('picks featured collections from distinct categories', () => {
    expect(getFeaturedCollections(items).map((item) => item.title)).toEqual(['A', 'D'])
  })

  it('validates category slugs', () => {
    expect(isCollectionCategory('animation-3d')).toBe(true)
    expect(isCollectionCategory('nope')).toBe(false)
  })
})
