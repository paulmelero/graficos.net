export const state = () => ({
  webmentions: null,
})
export const getters = {
  webmentions: state => state.webmentions,
}

export const mutations = {
  SET_WEB_MENTIONS(state, webmentions) {
    state.webmentions = webmentions
  },
}

export const actions = {
  setWebMentions({ commit }, webmentions) {
    commit('SET_WEB_MENTIONS', webmentions)
  },
}
