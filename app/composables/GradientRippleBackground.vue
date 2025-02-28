<template>
  <div ref="container" class="ripple-background"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';

// Component props
const props = defineProps({
  colorStart: {
    type: String,
    default: '#4158D0'
  },
  colorMiddle: {
    type: String,
    default: '#C850C0'
  },
  colorEnd: {
    type: String,
    default: '#FFCC70'
  },
  grainOpacity: {
    type: Number,
    default: 0.15
  },
  rippleIntensity: {
    type: Number,
    default: 1.0
  }
});

// Template refs
const container = ref(null);

// State variables
let renderer, scene, camera;
let canvas, clock, grainyMaterial;
let mouseX = 0, mouseY = 0;
let targetMouseX = 0, targetMouseY = 0;
let ripples = [];
let animationFrameId;
let grainTexture;

// Fragment shader for the background
const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColorStart;
  uniform vec3 uColorMiddle;
  uniform vec3 uColorEnd;
  uniform sampler2D uGrainTexture;
  uniform float uGrainOpacity;

  varying vec2 vUv;

  // Perlin noise functions
  vec4 permute(vec4 x) {
    return mod(((x*34.0)+1.0)*x, 289.0);
  }

  vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
  }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    // First corner
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    // Permutations
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    // Gradients
    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    // Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    // Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }

  void main() {
    // Gradient background
    vec3 color1 = uColorStart;
    vec3 color2 = uColorMiddle;
    vec3 color3 = uColorEnd;

    float noise = snoise(vec3(vUv * 2.0, uTime * 0.1)) * 0.1;

    // Mix between colors based on vertical position with some noise
    float t = vUv.y + noise;
    vec3 color = mix(color1, color2, smoothstep(0.0, 0.5, t));
    color = mix(color, color3, smoothstep(0.5, 1.0, t));

    // Add grain texture
    vec4 grainColor = texture2D(uGrainTexture, vUv * 3.0);
    color = mix(color, grainColor.rgb, uGrainOpacity * grainColor.a);

    gl_FragColor = vec4(color, 1.0);
  }
`;

// Vertex shader for the background
const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Create a grain texture procedurally
function createGrainTexture() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const value = Math.floor(Math.random() * 255);
    data[i] = value;     // r
    data[i + 1] = value; // g
    data[i + 2] = value; // b
    data[i + 3] = Math.random() * 128;  // alpha
  }

  ctx.putImageData(imageData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;

  return texture;
}

// Create a ripple
function createRipple(x, y) {
  const ripple = {
    x,
    y,
    radius: 0,
    maxRadius: 100 + Math.random() * 100,
    speed: 2 + Math.random() * 3,
    opacity: 1,
    color: new THREE.Color(
        0.5 + Math.random() * 0.5,
        0.5 + Math.random() * 0.5,
        0.5 + Math.random() * 0.5
    )
  };

  ripples.push(ripple);

  // Limit the number of ripples
  if (ripples.length > 20) {
    ripples.shift();
  }
}

// Render ripples on canvas
function renderRipples(ctx, width, height) {
  ctx.clearRect(0, 0, width, height);

  // Update and draw each ripple
  for (let i = ripples.length - 1; i >= 0; i--) {
    const ripple = ripples[i];

    // Update ripple state
    ripple.radius += ripple.speed;
    ripple.opacity = 1 - (ripple.radius / ripple.maxRadius);

    // Remove ripple if it's too big
    if (ripple.radius >= ripple.maxRadius) {
      ripples.splice(i, 1);
      continue;
    }

    // Draw ripple
    ctx.beginPath();
    ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255, 255, 255, ${ripple.opacity * 0.5})`;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

// Initialize the 3D scene
function init() {
  // Create renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.value.appendChild(renderer.domElement);

  // Create scene and camera
  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  camera.position.z = 1;

  // Create clock for animations
  clock = new THREE.Clock();

  // Create grain texture
  grainTexture = createGrainTexture();

  // Create background plane
  const geometry = new THREE.PlaneGeometry(2, 2);
  grainyMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uColorStart: { value: new THREE.Color(props.colorStart) },
      uColorMiddle: { value: new THREE.Color(props.colorMiddle) },
      uColorEnd: { value: new THREE.Color(props.colorEnd) },
      uGrainTexture: { value: grainTexture },
      uGrainOpacity: { value: props.grainOpacity }
    }
  });

  const mesh = new THREE.Mesh(geometry, grainyMaterial);
  scene.add(mesh);

  // Create a canvas for ripples
  canvas = document.createElement('canvas');
  canvas.width = container.value.clientWidth;
  canvas.height = container.value.clientHeight;
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.pointerEvents = 'none';
  container.value.appendChild(canvas);

  // Add event listeners
  window.addEventListener('resize', onResize);
  container.value.addEventListener('mousemove', onMouseMove);

  // Start animation loop
  animate();
}

// Handle window resize
function onResize() {
  const width = container.value.clientWidth;
  const height = container.value.clientHeight;

  renderer.setSize(width, height);

  canvas.width = width;
  canvas.height = height;
}

// Handle mouse movement
function onMouseMove(event) {
  const rect = container.value.getBoundingClientRect();
  targetMouseX = event.clientX - rect.left;
  targetMouseY = event.clientY - rect.top;

  // Create a new ripple only if the mouse has moved significantly
  const dx = targetMouseX - mouseX;
  const dy = targetMouseY - mouseY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance > 20) {
    createRipple(targetMouseX, targetMouseY);
    mouseX = targetMouseX;
    mouseY = targetMouseY;
  }
}

// Animation loop
function animate() {
  animationFrameId = requestAnimationFrame(animate);

  // Update shader uniforms
  grainyMaterial.uniforms.uTime.value = clock.getElapsedTime();

  // Render 3D scene
  renderer.render(scene, camera);

  // Render 2D ripples
  const ctx = canvas.getContext('2d');
  renderRipples(ctx, canvas.width, canvas.height);
}

// Initialize on component mount
onMounted(() => {
  init();
});

// Clean up on component unmount
onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize);
  container.value.removeEventListener('mousemove', onMouseMove);
  cancelAnimationFrame(animationFrameId);

  // Dispose Three.js resources
  renderer.dispose();
  scene.traverse((object) => {
    if (object.geometry) object.geometry.dispose();
    if (object.material) {
      if (object.material.map) object.material.map.dispose();
      object.material.dispose();
    }
  });

  // Remove canvases
  container.value.innerHTML = '';
});
</script>

<style scoped>
.ripple-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}
</style>