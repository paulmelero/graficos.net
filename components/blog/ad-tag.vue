<template>
  <div v-if="!dismissed && !isDev" class="carbon-wrapper">
    <button
      v-if="!dismissed"
      type="button"
      @click="dismissAd"
      class="dismiss-button shadow-md bg-fwhite rounded-full p-3 cursor-pointer"
      aria-label="Dismiss Add"
    >
      <i role="presentation" aria-hidden>✖</i>
    </button>
    <script
      async
      src="https://cdn.carbonads.com/carbon.js?serve=CE7DEK3N&placement=graficosnet"
      id="_carbonads_js"
    ></script>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dismissed: false,
      isDev: process.env.isDev,
    }
  },
  methods: {
    dismissAd() {
      if (process.browser) {
        const adContainer = document.getElementById('carbonads')
        const adScript = document.getElementById('_carbonads_js')
        adContainer && adContainer.remove()
        adScript && adScript.remove()
        this.dismissed = true
      }
    },
  },
}
</script>

<style lang="postcss">
.dismiss-button {
  width: 42px;
  height: 42px;
  position: absolute;
  left: -1.5em;
  top: -1.5em;
}
.dismiss-button i {
  font-style: normal;
}
.carbon-wrapper {
  position: fixed;
  right: 0;
  bottom: 0;
  z-index: 3;
  width: 300px;
  max-height: 192px;
  @apply border rounded shadow-md p-6 bg-fwhite;
}
#carbonads {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue',
    Helvetica, Arial, sans-serif;
  display: flex;
  background-color: hsl(0, 0%, 98%);
}

#carbonads a {
  color: inherit;
  text-decoration: none;
}

#carbonads a:hover {
  color: inherit;
}

#carbonads span {
  position: relative;
  display: block;
  overflow: hidden;
}

#carbonads .carbon-wrap {
  display: flex;
}

.carbon-img {
  display: block;
  margin: 0;
  line-height: 1;
}

.carbon-img img {
  display: block;
}

.carbon-text {
  font-size: 13px;
  padding: 10px;
  line-height: 1.5;
  text-align: left;
}

.carbon-poweredby {
  display: block;
  padding: 8px 10px;
  background: repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 5px,
      hsla(0, 0%, 0%, 0.025) 5px,
      hsla(0, 0%, 0%, 0.025) 10px
    )
    hsla(203, 11%, 95%, 0.4);
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
  font-size: 9px;
  line-height: 1;
}
</style>
