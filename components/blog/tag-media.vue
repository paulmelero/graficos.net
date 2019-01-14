<template>
  <div>
    {{ name }} {{ size }}
  </div>
</template>
<script>
export default {
  props: {
    name: {
      type: String
    },
    size: {
      type: Number
    },
  }
}
</script>
