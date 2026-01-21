<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import * as THREE from 'three'

const container = ref<HTMLElement | null>(null)
let renderer: THREE.WebGLRenderer | null = null
let animationId: number | null = null

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

onMounted(() => {
  if (!container.value) return

  // 1. Setup Scene
  const scene = new THREE.Scene()

  // 2. Camera (Isometric / Orthographic)
  const frustumSize = 30
  const aspect = container.value.clientWidth / container.value.clientHeight
  // Isometric view: Orthographic camera
  const camera = new THREE.OrthographicCamera(
    (frustumSize * aspect) / -2,
    (frustumSize * aspect) / 2,
    frustumSize / 2,
    frustumSize / -2,
    1,
    1000
  )

  // High enough position looking at center
  camera.position.set(20, 20, 20)
  camera.lookAt(0, 0, 0)

  // 3. Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.SoftShadowMap
  container.value.appendChild(renderer.domElement)

  // 4. Geometry: Simple Pillar
  const geometry = new THREE.BoxGeometry(PILLAR_WIDTH, PILLAR_HEIGHT, PILLAR_DEPTH)

  // Materials
  const materialMain = new THREE.MeshStandardMaterial({
    color: COLORS.primary,
    roughness: 0.8,
    metalness: 0.1,
  })

  const structureGroup = new THREE.Group()
  scene.add(structureGroup)

  // Position pillars at corners of the virtual cube area
  // We want the pillars to be centered on the corners of a square of size SCENE_SIZE?
  // Or the outer bounds of the scene?
  // Let's assume SCENE_SIZE is the outer bound.
  // Center of pillar needs to be at offset.

  const offset = SCENE_SIZE / 2 - PILLAR_WIDTH / 2

  // 4 Pillars at corners:
  // FL: (-x, +z), FR: (+x, +z), BR: (+x, -z), BL: (-x, -z)
  // Note: logic might vary depending on axis orientation preference,
  // but standard is +Z front, +X right.
  const positions = [
    { x: -offset, z: offset }, // Front Left
    { x: offset, z: offset }, // Front Right
    { x: offset, z: -offset }, // Back Right
    { x: -offset, z: -offset }, // Back Left
  ]

  positions.forEach((pos) => {
    const mesh = new THREE.Mesh(geometry, materialMain)
    mesh.position.set(pos.x, 0, pos.z)
    mesh.castShadow = true
    mesh.receiveShadow = true

    structureGroup.add(mesh)
  })

  // 4c. "V" Shapes between pillars
  // V Geometry
  // Construct a V shape profile
  const vShape = new THREE.Shape()
  const vW = PILLAR_HEIGHT // Total width of V at top
  const vH = PILLAR_HEIGHT * 0.6 // Slightly shorter?
  const vThickness = PILLAR_DEPTH // Thickness of the V legs

  // Coordinates relative to bottom-center of the V
  // Outer V
  vShape.moveTo(-vW / 2, vH) // Top-Left Outer
  vShape.lineTo(0, 0) // Bottom Tip Outer
  vShape.lineTo(vW / 2, vH) // Top-Right Outer

  // Inner V (Create thickness)
  // Simple approximation for a nice V
  vShape.lineTo(vW / 2 - vThickness, vH) // Top-Right Inner
  vShape.lineTo(0, vThickness * 1.2) // Bottom Tip Inner (slightly higher)
  vShape.lineTo(-vW / 2 + vThickness, vH) // Top-Left Inner

  vShape.lineTo(-vW / 2, vH) // Close

  const vGeo = new THREE.ExtrudeGeometry(vShape, {
    steps: 1,
    depth: PILLAR_DEPTH, // Match pillar depth
    bevelEnabled: false,
  })

  vGeo.center() // Centers at (0,0,0). Bounds: Y [-vH/2, vH/2]

  // Create 4 Vs
  // Pillar centers are at offset = 4.5.
  // Gap centers are at (0, 4.5), (4.5, 0), (0, -4.5), (-4.5, 0)

  // Distance from center to gap center = offset = 4.5

  for (let i = 0; i < 4; i++) {
    const vMesh = new THREE.Mesh(vGeo, materialMain)
    vMesh.castShadow = true
    vMesh.receiveShadow = true

    const vPivot = new THREE.Group()

    // Position vertically
    // Pyramid/Pillar Top is at Y = PILLAR_HEIGHT/2 = 6.
    // V Geo is centered. Height vH. Top is +vH/2.
    // We want Top at 6.
    // Y pos + vH/2 = 6  => Y = 6 - vH/2
    vMesh.position.y = PILLAR_HEIGHT / 2 - vH / 2

    // Position Z (Distance)
    vMesh.position.z = offset

    vPivot.add(vMesh)
    vPivot.rotation.y = i * (Math.PI / 2)

    structureGroup.add(vPivot)
  }

  // 5. Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.0)
  dirLight.position.set(15, 30, 20)
  dirLight.castShadow = true
  scene.add(dirLight)

  // Back light / Rim light for contrast
  const rimLight = new THREE.DirectionalLight(COLORS.accent, 0.5)
  rimLight.position.set(-20, 10, -10)
  scene.add(rimLight)

  // 6. Animation
  const animate = () => {
    animationId = requestAnimationFrame(animate)
    renderer!.render(scene, camera)
  }

  animate()

  // Resize handler
  window.addEventListener('resize', onResize)

  function onResize() {
    if (!container.value || !renderer) return
    const w = container.value.clientWidth
    const h = container.value.clientHeight
    const aspect = w / h

    // Update orthographic camera
    camera.left = (-frustumSize * aspect) / 2
    camera.right = (frustumSize * aspect) / 2
    camera.top = frustumSize / 2
    camera.bottom = -frustumSize / 2
    camera.updateProjectionMatrix()

    renderer.setSize(w, h)
  }
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  if (renderer) renderer.dispose()
})
</script>

<template>
  <div ref="container" class="w-full h-full min-h-[400px] relative">
    <!-- Container for Three.js -->
  </div>
</template>
