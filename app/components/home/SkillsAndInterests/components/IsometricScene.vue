<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import * as THREE from 'three'
// @ts-ignore
import artUrl from '@/assets/video/art.mp4'
// @ts-ignore
import natureUrl from '@/assets/video/nature.mp4'
// @ts-ignore
import programmingUrl from '@/assets/video/programming.mp4'

const container = ref<HTMLElement | null>(null)
let renderer: THREE.WebGLRenderer | null = null
let animationId: number | null = null
let camera: THREE.OrthographicCamera | null = null

// Interaction State
const activeVideoSrc = ref<string | null>(null)
const videos = [artUrl, natureUrl, programmingUrl]
const textureMap = new Map<string, THREE.VideoTexture>()

// Colors based on Tailwind config (Zinc 500, Amber 600)
const COLORS = {
  primary: 0x71717a, // gray-500
  accent: 0xd97706, // amber-600
  bg: 0xf4f4f5, // gray-100 (light background)
}

// Scene config
const SCENE_SIZE = 12
const PILLAR_HEIGHT = 12
const PILLAR_WIDTH = 3
const PILLAR_DEPTH = 3
const frustumSize = 30

// Shader Uniforms
const customUniforms = {
  uVideoTexture: { value: null as THREE.Texture | null },
  uResolution: { value: new THREE.Vector2() },
  uMixFactor: { value: 0.0 },
  uVideoAspect: { value: 16 / 9 },
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

onMounted(() => {
  if (!container.value) return

  // 1. Setup Scene
  const scene = new THREE.Scene()

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

  // 4. Load Video Textures
  videos.forEach((url) => {
    const video = document.createElement('video')
    video.src = url
    video.crossOrigin = 'anonymous'
    video.loop = true
    video.muted = true
    video.playsInline = true
    video.load()

    const texture = new THREE.VideoTexture(video)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    textureMap.set(url, texture)
  })

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

  // 6. Build Geometry
  const geometry = new THREE.BoxGeometry(PILLAR_WIDTH, PILLAR_HEIGHT, PILLAR_DEPTH)
  const structureGroup = new THREE.Group()
  scene.add(structureGroup)

  const offset = SCENE_SIZE / 2 - PILLAR_WIDTH / 2
  const positions = [
    { x: -offset, z: offset },
    { x: offset, z: offset },
    { x: offset, z: -offset },
    { x: -offset, z: -offset },
  ]

  // Pillars
  positions.forEach((pos) => {
    const mesh = new THREE.Mesh(geometry, materialMain)
    mesh.position.set(pos.x, 0, pos.z)
    mesh.castShadow = true
    mesh.receiveShadow = true
    structureGroup.add(mesh)
  })

  // "V" Shapes
  const vShape = new THREE.Shape()
  const vW = PILLAR_HEIGHT
  const vH = PILLAR_HEIGHT * 0.6
  const vThickness = PILLAR_DEPTH

  vShape.moveTo(-vW / 2, vH)
  vShape.lineTo(0, 0)
  vShape.lineTo(vW / 2, vH)
  vShape.lineTo(vW / 2 - vThickness, vH)
  vShape.lineTo(0, vThickness * 1.2)
  vShape.lineTo(-vW / 2 + vThickness, vH)
  vShape.lineTo(-vW / 2, vH)

  const vGeo = new THREE.ExtrudeGeometry(vShape, {
    steps: 1,
    depth: PILLAR_DEPTH - 0.08,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
  })
  vGeo.center()

  for (let i = 0; i < 4; i++) {
    const vMesh = new THREE.Mesh(vGeo, materialMain)
    vMesh.castShadow = true
    vMesh.receiveShadow = true
    vMesh.position.y = PILLAR_HEIGHT / 2 - vH / 2

    const vPivot = new THREE.Group()
    vMesh.position.z = offset
    vPivot.add(vMesh)
    vPivot.rotation.y = i * (Math.PI / 2)
    structureGroup.add(vPivot)
  }

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
    renderer!.render(scene, camera!)
  }
  animate()

  // Resize Listener
  window.addEventListener('resize', onResize)
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
    const newTex = textureMap.get(newSrc)
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

      newTex.image.play().catch(() => {})
    }
  } else {
    customUniforms.uMixFactor.value = 0.0
    customUniforms.uVideoTexture.value = null
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  if (animationId) cancelAnimationFrame(animationId)
  if (renderer) renderer.dispose()
})
</script>

<template>
  <div class="relative w-full h-full min-h-[400px]">
    <!-- Three.js Container -->
    <div ref="container" class="absolute inset-0 z-0"></div>

    <!-- Interaction Zones (Invisible) -->
    <div class="absolute inset-0 z-20 flex">
      <div
        v-for="(vid, index) in videos"
        :key="index"
        class="flex-1 h-full cursor-col-resize"
        @mouseenter="((activeVideoSrc = vid), $emit('video-hover', index))"
      ></div>
    </div>
  </div>
</template>
