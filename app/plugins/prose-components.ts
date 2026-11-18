import ProseA from '~/components/content/ProseA.vue'
import ProseImg from '~/components/content/ProseImg.vue'
import ProseTable from '~/components/content/ProseTable.vue'

// MDC resolves prose components at runtime. Register the local overrides so
// standalone <MDC> renders them instead of falling back to custom elements.
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('ProseA', ProseA)
  nuxtApp.vueApp.component('ProseImg', ProseImg)
  nuxtApp.vueApp.component('ProseTable', ProseTable)
})
