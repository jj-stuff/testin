<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import useRippleBackground from '../composables/useRippleBackground';

// Mouse position tracking for dreamy movement
const mouseX = ref(0);
const mouseY = ref(0);

// Ripple background
const { create, cleanup } = useRippleBackground();
let rippleInitialized = false;

// Random floating elements
const floatingElements = ref([]);
const generateFloatingElements = () => {
  const elements = [];
  for (let i = 0; i < 12; i++) {
    elements.push({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 5 + Math.random() * 15,
      opacity: 0.3 + Math.random() * 0.5,
      speed: 0.5 + Math.random() * 1.5,
      hue: Math.floor(Math.random() * 60)
    });
  }
  floatingElements.value = elements;
};

// Initialize
onMounted(() => {
  generateFloatingElements();

  window.addEventListener('mousemove', (e) => {
    mouseX.value = e.clientX;
    mouseY.value = e.clientY;
  });

  // Animate noise displacement
  const noise = document.querySelector('.noise-displacement');
  if (noise) {
    setInterval(() => {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      noise.setAttribute('x', `${x}%`);
      noise.setAttribute('y', `${y}%`);
    }, 200);
  }

  // Initialize ripple effect
  nextTick(() => {
    if (process.client && !rippleInitialized) {
      // Initialize with colors that complement your existing design
      create('.dreamscape', {
        colorStart: '#0a0908',
        colorMiddle: '#978476',
        colorEnd: '#7b9e89',
        rippleColor: 'rgba(211, 190, 173, 0.2)',
        grainAmount: 0.02,
        rippleSpeed: 0.8
      });
      rippleInitialized = true;
    }
  });
});

onBeforeUnmount(() => {
  // Cleanup ripple effect
  if (process.client && rippleInitialized) {
    cleanup();
  }
});
</script>

<template>
  <div class="dreamscape">
    <!-- SVG Filters -->
    <svg class="filters">
      <filter id="grainy-noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0.2" />
        <feBlend mode="overlay" in="SourceGraphic" />
      </filter>

      <filter id="displacement-filter">
        <feTurbulence type="turbulence" baseFrequency="0.01" numOctaves="3" result="turbulence"/>
        <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="30" xChannelSelector="R" yChannelSelector="G"/>
      </filter>

      <filter id="blur-filter">
        <feGaussianBlur stdDeviation="20" result="blur" />
        <feBlend in="SourceGraphic" in2="blur" mode="overlay" />
      </filter>
    </svg>

    <!-- Background Layers -->
    <div class="dream-layer grain-layer"></div>

    <!-- Gradient Orbs -->
    <div class="dream-layer gradient-orbs"
         :style="{
           transform: `translate(${mouseX / 80}px, ${mouseY / 80}px)`
         }">
    </div>

    <!-- Floating Elements -->
    <div class="floating-elements">
      <div
          v-for="(element, index) in floatingElements"
          :key="index"
          class="floating-element"
          :style="{
            left: `${element.x}%`,
            top: `${element.y}%`,
            width: `${element.size}px`,
            height: `${element.size}px`,
            opacity: element.opacity,
            filter: `hue-rotate(${element.hue}deg)`,
            animationDuration: `${20 + element.speed * 10}s`
          }">
      </div>
    </div>

    <!-- Content Container -->
    <div class="content-wrapper"
         :style="{
           transform: `translate(calc(-50% + ${-mouseX / 200}px), calc(-50% + ${-mouseY / 200}px))`
         }">
      <div class="content-blur"></div>
      <div class="content">
        <div class="title-container">
          <h1 class="artistic-title">METAMORPHOSIS</h1>
          <div class="title-backdrop"></div>
        </div>

        <p class="artistic-message">A collection of work undergoing an artistic rebirth </p>
        <p class="artistic-message"> Im doing a complete design refresh to better showcase my latest work. It will be down for a while</p>

        <div class="coming-soon-container">
          <span class="coming-soon-text">Emerging Soon</span>
          <div class="underline-animation"></div>
        </div>

        <div class="cta-container">
          <NuxtLink to="/ripple-demo" class="demo-link">
            View Ripple Effect Demo
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Keep your existing styles */
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Italiana&display=swap');

:root {
  --bg-color: #0a0908;
  --accent-1: #d3bead;
  --accent-2: #978476;
  --accent-3: #7b9e89;
  --text-primary: #ebe5df;
  --text-secondary: rgba(235, 229, 223, 0.8);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: var(--bg-color);
  font-family: 'Cormorant Garamond', serif;
  color: var(--text-primary);
}

.dreamscape {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

/* SVG Filters */
.filters {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
}

/* Background Layers */
.dream-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.grain-layer {
  filter: url(#grainy-noise);
  opacity: 0.35;
  mix-blend-mode: overlay;
  background-size: 200px;
}

.gradient-orbs {
  background:
      radial-gradient(circle at 30% 20%, rgba(211, 190, 173, 0.3), transparent 40%),
      radial-gradient(circle at 70% 60%, rgba(123, 158, 137, 0.4), transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(151, 132, 118, 0.3), transparent 40%);
  filter: url(#blur-filter);
  opacity: 0.6;
  mix-blend-mode: screen;
}

/* Floating Elements */
.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.floating-element {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle at center, var(--accent-1), var(--accent-3));
  mix-blend-mode: screen;
  animation: float-around 25s infinite ease-in-out;
}

@keyframes float-around {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(50px, -30px) rotate(90deg);
  }
  50% {
    transform: translate(10px, 40px) rotate(180deg);
  }
  75% {
    transform: translate(-40px, 10px) rotate(270deg);
  }
}

/* Content Styling */
.content-wrapper {
  position: fixed;
  top: 50%;
  left: 50%;
  /* Base transform applied in HTML with dynamic mouse movement */
  z-index: 10;
  width: 90%;
  max-width: 800px;
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  /* Ensure the box stays centered regardless of browser quirks */
  margin: 0;
  pointer-events: auto;
}

.content-blur {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(10px);
  background-color: rgba(10, 9, 8, 0.2);
  border-radius: 2px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  z-index: -1;
}

.content {
  position: relative;
  padding: min(4rem, 8vh) min(3rem, 5vw);
  text-align: center;
  width: 100%;
}

/* Title Styling */
.title-container {
  position: relative;
  margin-bottom: min(2.5rem, 5vh);
  display: inline-block;
  width: 100%;
}

.artistic-title {
  font-family: 'Italiana', serif;
  font-size: clamp(2rem, 8vw, 4rem);
  font-weight: 400;
  letter-spacing: 0.25em;
  color: var(--text-primary);
  margin: 0;
  position: relative;
  z-index: 2;
  text-shadow: 0 0 20px rgba(211, 190, 173, 0.3);
  filter: url(#displacement-filter);
}

.title-backdrop {
  position: absolute;
  width: 120%;
  height: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(90deg, transparent, rgba(211, 190, 173, 0.1), transparent);
  filter: blur(10px);
  z-index: 1;
}

/* Message Styling */
.artistic-message {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1rem, 3vw, 1.5rem);
  font-weight: 300;
  line-height: 1.6;
  color: var(--text-secondary);
  margin-bottom: min(1.5rem, 3vh);
  letter-spacing: 0.05em;
  max-width: 85%;
  margin-left: auto;
  margin-right: auto;
}

/* Coming Soon Styling */
.coming-soon-container {
  position: relative;
  display: inline-block;
  margin-top: min(1rem, 2vh);
  margin-bottom: min(2rem, 4vh);
}

.coming-soon-text {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.2rem, 3vw, 1.6rem);
  font-weight: 400;
  letter-spacing: 0.2em;
  color: var(--accent-1);
  text-transform: lowercase;
  font-style: italic;
}

.underline-animation {
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent-1), var(--accent-3), transparent);
  animation: underline-fade 4s ease-in-out infinite;
}

/* New Demo Link */
.cta-container {
  margin-top: 1.5rem;
}

.demo-link {
  display: inline-block;
  padding: 0.6rem 1.2rem;
  background-color: rgba(211, 190, 173, 0.2);
  color: var(--text-primary);
  border: 1px solid var(--accent-1);
  border-radius: 2px;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1rem;
  letter-spacing: 0.1em;
  text-decoration: none;
  transition: all 0.3s ease;
}

.demo-link:hover {
  background-color: rgba(211, 190, 173, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

@keyframes underline-fade {
  0%, 100% {
    opacity: 0.3;
    transform: scaleX(0.3);
  }
  50% {
    opacity: 0.8;
    transform: scaleX(1);
  }
}

/* Media Queries - More comprehensive breakpoints */
@media (max-width: 1200px) {
  .content-wrapper {
    width: 95%;
  }
}

@media (max-width: 992px) {
  .artistic-title {
    letter-spacing: 0.2em;
  }
}

@media (max-width: 768px) {
  .content {
    padding: 2.5rem 1.5rem;
  }

  .floating-element {
    opacity: 0.5;
  }
}

@media (max-width: 480px) {
  .content {
    padding: 2rem 1rem;
  }

  .artistic-title {
    letter-spacing: 0.15em;
  }

  .coming-soon-text {
    letter-spacing: 0.15em;
  }

  .floating-elements {
    opacity: 0.5; /* Reduce visual noise on very small screens */
  }
}

/* Height-based adjustments */
@media (max-height: 700px) {
  .content {
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
  }

  .title-container {
    margin-bottom: 1.5rem;
  }

  .artistic-message {
    margin-bottom: 1.5rem;
  }
}
</style>