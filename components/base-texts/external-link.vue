<template>
  <a
    :href="href"
    :title="href"
    target="_blank"
    rel="me noopener noreferer"
  >
  <slot></slot>
  <!-- <span
    class="external inline-block align-top transition:color"
    :class="{
      icon: !noIcon
    }"
  ></span> -->
  </a>
</template>

<script>
export default {
  props: {
    href: {
      type: String,
      required: true,
      default: () => '/'
    },
    /* noIcon: {
      type: Boolean,
      default: false
    } */
  }
}
</script>

<style scoped>
/* .external.icon {
  @apply relative pr-3;
  &::before,
  &::after {
    content: '';
    position: absolute;
    right: .5rem;
    top: 2px;
    opacity: .5;
     transition: background-color, border-color .2s  ease-out;
  }
  &::before {
    margin-right: -3px;
    width: 7px;
    height: 7px;
    border-top: solid 1px currentColor;
    border-right: solid 1px currentColor;
  }
  &::after {
    width: 1px;
    height: 8px;
    background-color: currentColor;
    transform: rotate(45deg);
  }
} */
</style>
