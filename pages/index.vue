<template>
  <section>
    <div class="xl:contianer p-4">
      <h1 class="text-3xl">{{ title }}</h1>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Home',
  head: {
    title: this.title,
    meta: [
      { hid: 'description', name: 'description',
        content: 'Welcome'
      }
    ]
  },
  data() {
    return {
      title: 'Home'
    }
  }
}
</script>
