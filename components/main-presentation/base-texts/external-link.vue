<template>
  <a
    :href="href"
    target="_blank"
    rel="me noopener noreferer"
  ><slot></slot></a>
</template>

<script>
export default {
  props: {
    href: {
      type: String,
      required: true,
      default: () => '/'
    },
  }
}
</script>
