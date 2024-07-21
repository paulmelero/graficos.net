import type { Post } from '~/types'

export const useMinutesToRead = ({ post }: { post: ComputedRef<Post> }) => {
  const minutesToRead = ref(1)
  let lengthOfPost = ref(0)

  const calculateLengthOfPost = (postBodyNode: Post['body']) => {
    if (postBodyNode && postBodyNode.children) {
      postBodyNode.children.forEach((child: any) => {
        if (child.type === 'text') {
          lengthOfPost.value += child.value.length
        }
        calculateLengthOfPost(child)
      })
    }
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

    if (minutesToRead.value > 10) {
      return new Array(Math.floor(minutesToRead.value / 10)).fill('🥪🧃').join('')
    }

    // using `ceil` to get at least 1 cup of coffee
    return new Array(Math.ceil(minutesToRead.value / 4)).fill('☕️').join('')
  })

  watchEffect(() => {
    if (!post.value || !post.value.body) return
    calculateLengthOfPost(post.value.body)
    minutesToRead.value = calculateMinutes(lengthOfPost.value)
  })

  return {
    emojisWhileReading,
    formattedMinutesToRead,
  }
}
