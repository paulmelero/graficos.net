<template>
  <section>
    <div>
      <h1>{{ title }}</h1>
    </div>
  </section>
</template>

<script>
const HOME = 'Home'
export default {
  name: HOME,
  head: {
    title: HOME,
  },
  data() {
    return {
      title: HOME
    }
  }
}
</script>
