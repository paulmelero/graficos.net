export default {
  data() {
    return {
      timerId: null,
    }
  },
  methods: {
    /**
     * @param {(arg0?: any) => void} fn
     * @param {number} delay
     */
    simpleDebounce(fn, delay = 300) {
      // caveat: only 1 timeout at a time because of the timerId;
      // that's why we leave this inside the component scope
      // and not as a global utility
      return ((...args) => {
        // only in browser
        clearTimeout(this.timerId)
        this.timerId = setTimeout(() => {
          this.timerId = null
          fn(...args)
        }, delay)
      })()
    },
  },
}
