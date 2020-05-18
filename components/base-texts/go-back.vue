<template>
  <nuxt-link class="mb-8 inline-block sm:text-lg" :to="routeBack">&lt; Get back to {{ routeBackName }}</nuxt-link>
</template>

<script>
const root = '/'

export default {
  props: {
    dynamicParam: String,
  },
  computed: {
    routeBackName() {
      const childrens = [...this.$router.currentRoute.matched]
      let parents
      let result
      if (childrens && childrens.length) {
        parents = childrens.map(this.getParent)
        parents.filter(name => !!name)
      }
      if (parents && parents[0] && Array.isArray(parents[0])) {
        result = parents[0][0]
      } else if (parents && parents[0]) {
        result = parents[0]
      } else {
        result = root
      }
      return result
    },
    routeBack() {
      return this.routeBackName !== root ? root + this.routeBackName : root
    },
  },
  methods: {
    getParent(route) {
      if (!route) {
        return root
      }
      return (route.path + '')
        .replace(/-/gi, ' ')
        .replace(/^\//gi, '')
        .split('/')
        .map(part => {
          if (part === ':lang') {
            return ''
          }
          if (part && !part.match(/^:/)) {
            return part
          } else if (part && part.match(/^:/)) {
            return this.dynamicParam
          } else {
            return ''
          }
        })
    },
  },
}
</script>
