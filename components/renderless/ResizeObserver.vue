<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

let observer: ResizeObserver | null = null

onMounted(() => {
  observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      console.log(entry.target.clientWidth, entry.target.clientHeight)
    }
  })
  observer.observe($el)
})
</script>
