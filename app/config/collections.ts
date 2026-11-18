export const collectionCategorySlugs = [
  'fonts',
  'software-projects',
  'movements',
  'websites',
  'artificial-intelligence',
  'animation-3d',
  'web-games',
] as const

export type CollectionCategory = (typeof collectionCategorySlugs)[number]

export type CollectionCategoryConfig = {
  slug: CollectionCategory
  label: string
  subline?: string
}

export const collectionCategories: ReadonlyArray<CollectionCategoryConfig> = [
  {
    slug: 'fonts',
    label: 'Fonts',
    subline: 'Apart from the all time classics, I want to share a few Fonts I encounter on the Internet that I liked',
  },
  { slug: 'software-projects', label: 'Software' },
  { slug: 'movements', label: 'Movements' },
  { slug: 'websites', label: 'Websites' },
  { slug: 'artificial-intelligence', label: 'AI' },
  { slug: 'animation-3d', label: 'Animation / 3D' },
  { slug: 'web-games', label: 'Web Games' },
]

export const isCollectionCategory = (value: string): value is CollectionCategory =>
  (collectionCategorySlugs as readonly string[]).includes(value)

export const collectionCategoryLabel = (category: CollectionCategory) =>
  collectionCategories.find((item) => item.slug === category)?.label ?? category

export const collectionCategorySubline = (category: CollectionCategory) =>
  collectionCategories.find((item) => item.slug === category)?.subline

export const groupCollectionsByCategory = <T extends { category: CollectionCategory }>(items: T[]) =>
  collectionCategories
    .map((category) => ({
      ...category,
      items: items.filter((item) => item.category === category.slug),
    }))
    .filter((group) => group.items.length > 0)

export const getFeaturedCollections = <T extends { category: CollectionCategory; featured?: boolean }>(
  items: T[],
  limit = 4
) => {
  const seen = new Set<CollectionCategory>()

  return items
    .filter((item) => {
      if (!item.featured || seen.has(item.category)) return false

      seen.add(item.category)
      return true
    })
    .slice(0, limit)
}
