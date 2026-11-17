import type { CollectionInList } from '~/types'

export const useCollections = () => {
  const { data: collections } = useAsyncData<CollectionInList[]>('collections', async () => {
    const items = await queryCollection('collections')
      .select('path', 'title', 'link', 'createdAt', 'description', 'category', 'featured')
      .order('createdAt', 'DESC')
      .all()

    return items as CollectionInList[]
  })

  return { collections }
}
