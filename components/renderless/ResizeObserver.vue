<script>
import { mapActions } from 'vuex'

import simpleDebounce from '~/mixins/simple-debounce-vue-mixin'

export default {
  name: 'resize-observer',
  mixins: [simpleDebounce],
  mounted() {
    if (process.browser) {
      this.handleResize()
      window.addEventListener('resize', this.handleResize, {
        passive: true,
      })
    }
  },
  beforeDestroy() {
    if (process.browser) {
      window.removeEventListener('resize', this.handleResize, { passive: true })
    }
  },
  methods: {
    ...mapActions('layout', ['setSize']),
    handleResize() {
      if (process.browser) {
        this.simpleDebounce(() => {
          this.setSize(window.innerWidth)
        }, 100)
      }
    },
  },
  render() {
    return {}
  },
}
</script>
