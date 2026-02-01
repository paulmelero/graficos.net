<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import * as THREE from 'three'
import { clamp } from 'three/src/math/MathUtils.js'

import artUrl from '@/assets/video/art.mp4'
import natureUrl from '@/assets/video/nature.mp4'
import programmingUrl from '@/assets/video/programming.mp4'
import { easeInOutCubic } from './utils/easeInOutCubic'

const props = defineProps<{
  scrollProgress: number
}>()

const container = ref<HTMLElement | null>(null)
let renderer: THREE.WebGLRenderer | null = null
let animationId: number | null = null
let camera: THREE.OrthographicCamera | null = null
let scene: THREE.Scene | null = null
let structureGroup: THREE.Group | null = null

// Golden Ratio
const PHI = (1 + Math.sqrt(5)) / 2

// Videos State
const videos = [artUrl, natureUrl, programmingUrl]
const eagerVideoUrl = artUrl
const deferredVideoUrls = [natureUrl, programmingUrl]
const activeVideoSrc = ref<string | null>(null)
const textureMap = new Map<string, THREE.VideoTexture>()
const fullyBufferedVideos = new Set<string>()

const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

// Scene config
const SCENE_SIZE = 12
const frustumSize = 30

// Mobile
const isMobile = ref(false)
const MOBILE_BREAKPOINT = 1024

// Camera & Group Positions
const INITIAL_CAMERA_POSITION = new THREE.Vector3(20, 20, 20)
const TOP_CAMERA_POSITION = new THREE.Vector3(0, 38, 0.0001)
const INITIAL_GROUP_POSITION = new THREE.Vector3(0, SCENE_SIZE * 0.75, 0)
const TARGET_GROUP_POSITION = new THREE.Vector3(-SCENE_SIZE * 0.3, 0, SCENE_SIZE)
const TARGET_GROUP_ROTATION = Math.PI / 4
const tempVector = new THREE.Vector3()
const edgeDirection = new THREE.Vector3()
const edgeQuaternion = new THREE.Quaternion()
const EDGE_UP_AXIS = new THREE.Vector3(0, 1, 0)
let storyProgress = 0

// Colors based on Tailwind config (Zinc 500, Amber 600)
const COLORS = {
  primary: 0x71717a, // gray-500
  accent: 0xd97706, // amber-600
  bg: 0xf4f4f5, // gray-100 (light background)
}

// Shader Uniforms
const customUniforms = {
  uVideoTexture: { value: null as THREE.Texture | null },
  uResolution: { value: new THREE.Vector2() },
  uMixFactor: { value: 0.0 },
  uVideoAspect: { value: 16 / 9 },
}

let deferredVideosObserver: IntersectionObserver | null = null

const clampProgress = (value: number) => clamp(value, 0, 1)

const applyStoryState = (progress: number) => {
  const nextProgress = prefersReducedMotion.value ? 0 : clampProgress(progress)
  storyProgress = nextProgress

  if (!camera || !structureGroup) {
    return
  }

  // Scale progress to complete animation by the 95% mark
  const animationProgress = Math.min(nextProgress / 0.95, 0.9)
  // Apply easing ONCE to the scaled progress
  const easedAnimation = easeInOutCubic(animationProgress)

  // Apply the single eased value to all animations
  tempVector.copy(INITIAL_CAMERA_POSITION).lerp(TOP_CAMERA_POSITION, easedAnimation)
  camera.position.copy(tempVector)
  camera.lookAt(0, 0, 0)

  const targetPosition = isMobile.value ? INITIAL_GROUP_POSITION : TARGET_GROUP_POSITION
  tempVector.copy(INITIAL_GROUP_POSITION).lerp(targetPosition, easedAnimation)
  structureGroup.position.copy(tempVector)

  const targetRotation = isMobile.value ? 0 : TARGET_GROUP_ROTATION
  structureGroup.rotation.y = THREE.MathUtils.lerp(0, targetRotation, easedAnimation)
}

const updateIsMobile = () => {
  if (typeof window === 'undefined') {
    return
  }

  isMobile.value = window.innerWidth < MOBILE_BREAKPOINT
}

function onResize() {
  if (!container.value || !renderer || !camera) return
  const w = container.value.clientWidth
  const h = container.value.clientHeight
  const aspect = w / h

  camera.left = (-frustumSize * aspect) / 2
  camera.right = (frustumSize * aspect) / 2
  camera.top = frustumSize / 2
  camera.bottom = -frustumSize / 2
  camera.updateProjectionMatrix()

  renderer.setSize(w, h)

  const pixelRatio = renderer.getPixelRatio()
  customUniforms.uResolution.value.set(w * pixelRatio, h * pixelRatio)
}

const createVideoTexture = (url: string) => {
  const existing = textureMap.get(url)

  if (existing) {
    const element = existing.image as HTMLVideoElement | undefined

    if (element && !fullyBufferedVideos.has(url)) {
      element.preload = 'metadata'
      element.load()
    }

    return existing
  }

  const video = document.createElement('video')
  video.src = url
  video.crossOrigin = 'anonymous'
  video.loop = true
  video.muted = true
  video.playsInline = true
  video.preload = 'metadata'
  video.load()

  const texture = new THREE.VideoTexture(video)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  textureMap.set(url, texture)

  return texture
}

const scheduleVideoPlay = (video: HTMLVideoElement, url: string) => {
  const startPlayback = () => {
    fullyBufferedVideos.add(url)
    void video.play().catch(() => {})
  }

  if (typeof window === 'undefined') {
    startPlayback()
    return
  }

  const idleScheduler = (window as any).requestIdleCallback as
    | ((callback: () => void, opts?: { timeout?: number }) => number)
    | undefined

  if (idleScheduler) {
    idleScheduler(startPlayback, { timeout: 200 })
    return
  } else {
    // Fallback

    window.setTimeout(startPlayback, 50)
  }
}

onMounted(() => {
  if (!container.value) return

  // 1. Setup Scene
  scene = new THREE.Scene()

  // 2. Camera
  const aspect = container.value.clientWidth / container.value.clientHeight
  camera = new THREE.OrthographicCamera(
    (frustumSize * aspect) / -2,
    (frustumSize * aspect) / 2,
    frustumSize / 2,
    frustumSize / -2,
    1,
    1000
  )

  camera.position.set(20, 20, 20)
  camera.lookAt(0, 0, 0)

  // 3. Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  container.value.appendChild(renderer.domElement)

  // Initial Resize to set uniforms
  onResize()
  updateIsMobile()

  // 4. Load Video Textures
  createVideoTexture(eagerVideoUrl)

  if (container.value && typeof window !== 'undefined' && 'IntersectionObserver' in window) {
    deferredVideosObserver = new IntersectionObserver(
      (entries) => {
        const isVisible = entries.some((entry) => entry.isIntersecting)

        if (!isVisible) {
          return
        }

        deferredVideoUrls.forEach((url) => {
          createVideoTexture(url)
        })

        deferredVideosObserver?.disconnect()
        deferredVideosObserver = null
      },
      { rootMargin: '200px 0px' }
    )

    deferredVideosObserver.observe(container.value)
  } else {
    deferredVideoUrls.forEach((url) => {
      createVideoTexture(url)
    })
  }

  // We need to initialise it after loading the video texture
  if (!activeVideoSrc.value && videos.length > 0) {
    activeVideoSrc.value = videos[0] ?? null
  }

  // 5. Shared Material with Custom Shader Logic
  const materialMain = new THREE.MeshStandardMaterial({
    color: COLORS.primary,
    roughness: 0.8,
    metalness: 0.1,
  })

  materialMain.onBeforeCompile = (shader) => {
    shader.uniforms.uVideoTexture = customUniforms.uVideoTexture
    shader.uniforms.uResolution = customUniforms.uResolution
    shader.uniforms.uMixFactor = customUniforms.uMixFactor
    shader.uniforms.uVideoAspect = customUniforms.uVideoAspect

    // Add Overlay Blend Function
    shader.fragmentShader =
      `
      uniform sampler2D uVideoTexture;
      uniform vec2 uResolution;
      uniform float uMixFactor;
      uniform float uVideoAspect;

      float blendOverlay(float base, float blend) {
        return base < 0.5 ? (2.0 * base * blend) : (1.0 - 2.0 * (1.0 - base) * (1.0 - blend));
      }

      vec3 blendOverlay(vec3 base, vec3 blend) {
        return vec3(
          blendOverlay(base.r, blend.r),
          blendOverlay(base.g, blend.g),
          blendOverlay(base.b, blend.b)
        );
      }
    ` + shader.fragmentShader

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <map_fragment>',
      `
      #include <map_fragment>

      if (uMixFactor > 0.0) {
        vec2 screenUV = gl_FragCoord.xy / uResolution;

        // Aspect Correction (Cover)
        float screenAspect = uResolution.x / uResolution.y;
        vec2 uv = screenUV;

        if (screenAspect > uVideoAspect) {
          // Screen is wider than video (crop top/bottom)
          float scale = screenAspect / uVideoAspect;
          uv.y = (uv.y - 0.5) / scale + 0.5;
        } else {
          // Screen is taller than video (crop sides)
          float scale = uVideoAspect / screenAspect;
          uv.x = (uv.x - 0.5) / scale + 0.5;
        }

        vec4 videoColor = texture2D(uVideoTexture, uv);
        // Correct sRGB texture to Linear space for blending
        videoColor.rgb = pow(videoColor.rgb, vec3(2.2));

        // Apply Overlay Blend
        vec3 blended = blendOverlay(diffuseColor.rgb, videoColor.rgb);

        // Mix based on factor
        diffuseColor.rgb = mix(diffuseColor.rgb, blended, uMixFactor);
      }
      `
    )
  }

  // 6. Build Dodecahedron Geometry
  structureGroup = new THREE.Group()
  scene.add(structureGroup)

  // Dodecahedron vertices using golden ratio
  const scale = SCENE_SIZE / 4 // Scale to fit our scene

  // Create dodecahedron vertices
  const vertices = [
    // Cube vertices (±1, ±1, ±1)
    new THREE.Vector3(1, 1, 1).multiplyScalar(scale),
    new THREE.Vector3(1, 1, -1).multiplyScalar(scale),
    new THREE.Vector3(1, -1, 1).multiplyScalar(scale),
    new THREE.Vector3(1, -1, -1).multiplyScalar(scale),
    new THREE.Vector3(-1, 1, 1).multiplyScalar(scale),
    new THREE.Vector3(-1, 1, -1).multiplyScalar(scale),
    new THREE.Vector3(-1, -1, 1).multiplyScalar(scale),
    new THREE.Vector3(-1, -1, -1).multiplyScalar(scale),

    // Face centers of cube (0, ±1/φ, ±φ) and cyclic permutations
    new THREE.Vector3(0, 1 / PHI, PHI).multiplyScalar(scale),
    new THREE.Vector3(0, 1 / PHI, -PHI).multiplyScalar(scale),
    new THREE.Vector3(0, -1 / PHI, PHI).multiplyScalar(scale),
    new THREE.Vector3(0, -1 / PHI, -PHI).multiplyScalar(scale),

    new THREE.Vector3(1 / PHI, PHI, 0).multiplyScalar(scale),
    new THREE.Vector3(1 / PHI, -PHI, 0).multiplyScalar(scale),
    new THREE.Vector3(-1 / PHI, PHI, 0).multiplyScalar(scale),
    new THREE.Vector3(-1 / PHI, -PHI, 0).multiplyScalar(scale),

    new THREE.Vector3(PHI, 0, 1 / PHI).multiplyScalar(scale),
    new THREE.Vector3(PHI, 0, -1 / PHI).multiplyScalar(scale),
    new THREE.Vector3(-PHI, 0, 1 / PHI).multiplyScalar(scale),
    new THREE.Vector3(-PHI, 0, -1 / PHI).multiplyScalar(scale),
  ]

  // Dodecahedron edges (connecting vertices)
  const edges = [
    [0, 12],
    [0, 16],
    [0, 8],
    [1, 12],
    [1, 17],
    [1, 9],
    [2, 13],
    [2, 16],
    [2, 10],
    [3, 13],
    [3, 17],
    [3, 11],
    [4, 14],
    [4, 18],
    [4, 8],
    [5, 14],
    [5, 19],
    [5, 9],
    [6, 15],
    [6, 18],
    [6, 10],
    [7, 15],
    [7, 19],
    [7, 11],
    [8, 10],
    [9, 11],
    [12, 14],
    [13, 15],
    [16, 17],
    [18, 19],
    [8, 4],
    [9, 5],
    [10, 6],
    [11, 7],
    [12, 1],
    [13, 3],
    [14, 5],
    [15, 7],
    [16, 2],
    [17, 3],
    [18, 6],
    [19, 7],
  ]

  // Edge geometry config
  // Radius of the capsule edges and the cyllinders
  const edgeRadius = 0.33

  // Create capsules for each edge
  edges.forEach((edge) => {
    const [startIdx, endIdx] = edge as [number, number]
    const start = vertices[startIdx]!
    const end = vertices[endIdx]!

    // Calculate edge properties
    edgeDirection.subVectors(end, start)
    const length = edgeDirection.length()
    const center = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)

    const capsuleLength = Math.max(length - edgeRadius * 2, 0)
    const capsuleGeometry = new THREE.CapsuleGeometry(edgeRadius, capsuleLength, 8, 16)
    const edgeMesh = new THREE.Mesh(capsuleGeometry, materialMain)
    edgeMesh.position.copy(center)

    edgeQuaternion.setFromUnitVectors(EDGE_UP_AXIS, edgeDirection.normalize())
    edgeMesh.setRotationFromQuaternion(edgeQuaternion)

    edgeMesh.castShadow = true
    edgeMesh.receiveShadow = true

    structureGroup!.add(edgeMesh)
  })

  const nodeGeometry = new THREE.SphereGeometry(edgeRadius, 16, 16)
  vertices.forEach((vertex) => {
    const node = new THREE.Mesh(nodeGeometry, materialMain)
    node.position.copy(vertex)
    node.castShadow = true
    node.receiveShadow = true
    structureGroup!.add(node)
  })

  // 7. Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.0)
  dirLight.position.set(15, 30, 20)
  dirLight.castShadow = true
  dirLight.shadow.mapSize.width = 1024
  dirLight.shadow.mapSize.height = 1024
  dirLight.shadow.radius = 4
  dirLight.shadow.bias = -0.0005
  dirLight.shadow.normalBias = 0.02
  scene.add(dirLight)

  const rimLight = new THREE.DirectionalLight(COLORS.accent, 0.5)
  rimLight.position.set(-20, 10, -10)
  scene.add(rimLight)

  // 8. Animation Loop
  const animate = () => {
    animationId = requestAnimationFrame(animate)
    if (renderer && scene && camera) {
      renderer.render(scene, camera)
    }
  }
  animate()

  // Resize Listener
  window.addEventListener('resize', onResize)
  window.addEventListener('resize', updateIsMobile)

  applyStoryState(storyProgress)
})

watch(
  () => props.scrollProgress,
  (progress) => {
    applyStoryState(progress ?? 0)
  },
  { immediate: true }
)

watch(isMobile, () => {
  applyStoryState(storyProgress)
})

watch(prefersReducedMotion, () => {
  applyStoryState(prefersReducedMotion.value ? 0 : (props.scrollProgress ?? 0))
})

// Video Playback Watcher
watch(activeVideoSrc, (newSrc, oldSrc) => {
  if (oldSrc) {
    const oldTex = textureMap.get(oldSrc)
    if (oldTex && oldTex.image) {
      oldTex.image.pause()
    }
  }

  if (newSrc) {
    const newTex = createVideoTexture(newSrc)
    if (newTex) {
      customUniforms.uVideoTexture.value = newTex
      customUniforms.uMixFactor.value = 1.0

      const vid = newTex.image
      const updateAspect = () => {
        if (vid.videoWidth && vid.videoHeight) {
          customUniforms.uVideoAspect.value = vid.videoWidth / vid.videoHeight
        }
      }

      if (vid.readyState >= 1) {
        updateAspect()
      } else {
        vid.addEventListener('loadedmetadata', updateAspect, { once: true })
      }

      if (vid.preload !== 'auto') {
        vid.preload = 'auto'
        vid.load()
      }

      scheduleVideoPlay(vid, newSrc)
    }
  } else {
    customUniforms.uMixFactor.value = 0.0
    customUniforms.uVideoTexture.value = null
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  window.removeEventListener('resize', updateIsMobile)
  if (animationId) cancelAnimationFrame(animationId)
  if (renderer) renderer.dispose()
  if (deferredVideosObserver) deferredVideosObserver.disconnect()
})
</script>

<template>
  <div class="relative w-full h-full" :data-scroll-progress="scrollProgress">
    <!-- Three.js Container -->
    <div ref="container" class="h-[200vh] z-0"></div>

    <!-- Interaction Zones (Invisible) -->
    <div class="absolute inset-0 z-10 flex">
      <button
        v-for="(vid, index) in videos"
        :key="index"
        aria-hidden
        class="flex-1 h-full cursor-col-resize hover:bg-[rgba(255,255,255,0.05)] focus:bg-[rgba(255,255,255,0.05)] focus:outline-none"
        type="button"
        @click.prevent
        @mouseenter="((activeVideoSrc = vid), $emit('video-hover', index))"
      ></button>
    </div>
  </div>
</template>
