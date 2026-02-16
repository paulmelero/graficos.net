import type { Post } from '~/types'

const post: Partial<Post> = {
  _id: '1234567890',
  title: 'Test post',
  description: 'This is a test post.',
  summary: 'Test',
  thumbnail: 'https://test.com',
  lang: 'EN',
  date: '2024',
  tags: [],
  body: {
    type: 'root',
    children: [],
  },
}
const fakePostFactory: (averageChildren: number, nestedLevels?: number, averageLength?: number) => Post = (
  averageChildren,
  nestedLevels = 1,
  averageLength = 200
) => {
  const postCopy = structuredClone(post) as Post

  for (let i = 0; i < nestedLevels; i++) {
    for (let j = 0; j < averageChildren; j++) {
      postCopy.body!.children.push({
        type: 'paragraph',
        children: [
          {
            value: Array(averageLength).fill('x').join(''),
            type: 'text',
          },
        ],
      })
    }
  }
  return postCopy
}

describe('Minutes to read', () => {
  it.each([
    [0, 0, { emojisWhileReading: '🌸', formattedMinutesToRead: '1 min' }],
    [10, 0, { emojisWhileReading: '🌸', formattedMinutesToRead: '1 min' }],
    [10, 1, { emojisWhileReading: '☕️', formattedMinutesToRead: '2 mins' }],
    [10, 2, { emojisWhileReading: '☕️', formattedMinutesToRead: '5 mins' }],
    [10, 3, { emojisWhileReading: '☕️', formattedMinutesToRead: '7 mins' }],
    [10, 4, { emojisWhileReading: '☕️', formattedMinutesToRead: '10 mins' }],
    [9, 5, { emojisWhileReading: '☕️', formattedMinutesToRead: '11 mins' }],
    [20, 4, { emojisWhileReading: '☕️☕️', formattedMinutesToRead: '20 mins' }],
    [22, 5, { emojisWhileReading: '🧘🍹', formattedMinutesToRead: '22 mins' }],
  ])('should return the correct value for %s children and %s levels deep', (children, levels, result) => {
    const post = computed(() => fakePostFactory(children, levels))

    const { formattedMinutesToRead, emojisWhileReading } = useMinutesToRead({ post })

    expect(result).toEqual({
      formattedMinutesToRead: unref(formattedMinutesToRead),
      emojisWhileReading: unref(emojisWhileReading),
    })
  })
})
