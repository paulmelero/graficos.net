import type { MarkdownRoot, MinimalNode } from '@nuxt/content'
import type { Post } from '~/types'

export const useMinutesToRead = ({ post }: { post: Ref<Post | undefined | null> }) => {
  const minutesToRead = ref(1)
  const lengthOfPost = ref(0)

  const calculateLengthOfPost = (data: MarkdownRoot): number => {
    if (!data || !data.value) return 0

    const calculateLengthOfItems = (items: MinimalNode[] | MinimalNode): number => {
      if (!Array.isArray(items)) return 0

      const [tag, , ...children] = items

      if (tag === 'style') return 0
      if (!children || !children.length) return 0

      return children.reduce((_acc, child: MinimalNode | Record<string, unknown>): number => {
        if (typeof child === 'string') {
          return _acc + child.length
        }

        if (Array.isArray(child)) {
          return _acc + calculateLengthOfItems(child)
        }

        return _acc
      }, 0)
    }

    return data.value.reduce((acc, item) => {
      if (Array.isArray(item)) {
        return acc + calculateLengthOfItems(item)
      }

      if (typeof item === 'string') {
        return acc + item.length
      }

      return acc
    }, 0)
  }

  const formattedMinutesToRead = computed(() => {
    const nativePluralRules = new Intl.PluralRules()
    const options = new Map([
      ['zero', 'zero time to'],
      ['one', 'min'],
      ['two', 'mins'],
      ['few', 'mins'],
      ['many', 'mins'],
      ['other', 'mins'],
    ])
    const formatTime = (minutes: number) => {
      const rule = nativePluralRules.select(minutes)
      const suffix = options.get(rule)
      return `${minutes} ${suffix}`
    }
    return formatTime(minutesToRead.value || 1)
  })

  const calculateMinutes = (textLength: number) => {
    return Math.floor(textLength / 800)
  }

  const emojisWhileReading = computed(() => {
    if (!minutesToRead.value) return '🌸'

    if (minutesToRead.value < 10) {
      return '☕️'
    }

    if (minutesToRead.value >= 10 && minutesToRead.value <= 20) {
      return new Array(Math.floor(minutesToRead.value / 10)).fill('☕').join('')
    }

    if (minutesToRead.value > 20) {
      return '🧘🍹'
    }
  })

  // using `ceil` to get at least 1 cup of coffee
  watchEffect(() => {
    if (!post || !post.value || !post.value.body) return
    lengthOfPost.value = calculateLengthOfPost(post.value.body)
    minutesToRead.value = calculateMinutes(lengthOfPost.value)
  })

  return {
    emojisWhileReading,
    formattedMinutesToRead,
  }
}
