<template>
  <nuxt-link class="mb-8 inline-block sm:text-lg" :to="routeBack">&lt; Get back to {{ routeBackName }}</nuxt-link>
</template>

<script>
const root = '/'

export default {
  props:
    dynamicParam: String,
  },
  computed: {
    routeBackName() {
      return ''
    },
    routeBack() {
      return this.routeBackName !== root ? root + this.routeBackName : root
    },
  },

}
</script>
