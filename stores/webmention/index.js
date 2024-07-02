import { defineStore } from 'pinia'

export const useWebmentionStore = defineStore('webmention', {
  state: () => ({
    webmentions: null,
  }),
  actions: {
    setWebMentions(webmentions) {
      this.webmentions = webmentions
    },
  },
})
