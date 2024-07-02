import { theme } from '~/tailwind.config'

const screensInt = Object.keys(theme.extend.screens).reduce((obj, key) => {
  return {
    ...obj,
    [key]: parseInt(theme.extend.screens[key]),
  }
}, {})

export const state = () => ({
  xs: false,
  sm: false,
  md: false,
  lg: false,
  xl: true,
})

export const mutationTypes = {
  SET_SIZE: 'SET_SIZE',
}

export const mutations = {
  [mutationTypes.SET_SIZE](state, width) {
    state.xs = width <= screensInt['xs']
    state.sm = width < screensInt['md'] && width >= screensInt['sm']
    state.md = width < screensInt['lg'] && width >= screensInt['md']
    state.lg = width < screensInt['xl'] && width >= screensInt['lg']
    state.xl = width >= screensInt['xl']
  },
}

export const actions = {
  setSize({ commit }, breakpointObject) {
    commit(mutationTypes.SET_SIZE, breakpointObject)
  },
}

export const getters = {
  isMobile: state => state.xs || state.sm,
  isTablet: state => state.md,
  isDesktop: state => state.lg,
  isBigScreen: state => state.xl,
}
