<template>
  <div class="ripple-demo">
    <div ref="backgroundContainer" class="background-container"></div>

    <div class="content">
      <h1 class="title">Ripple Background Demo</h1>
      <p class="description">Move your mouse over the page to create ripple effects</p>

      <div class="controls">
        <div class="control-group">
          <label>
            Start Color:
            <input type="color" v-model="colors.start" @change="updateBackground" />
          </label>
        </div>

        <div class="control-group">
          <label>
            Middle Color:
            <input type="color" v-model="colors.middle" @change="updateBackground" />
          </label>
        </div>

        <div class="control-group">
          <label>
            End Color:
            <input type="color" v-model="colors.end" @change="updateBackground" />
          </label>
        </div>

        <div class="control-group">
          <label>
            Grain Amount:
            <input
                type="range"
                min="0"
                max="0.2"
                step="0.01"
                v-model="grainAmount"
                @change="updateBackground"
            />
            {{ Number(grainAmount).toFixed(2) }}
          </label>
        </div>

        <div class="control-group">
          <label>
            Ripple Speed:
            <input
                type="range"
                min="0.5"
                max="5"
                step="0.1"
                v-model="rippleSpeed"
                @change="updateBackground"
            />
            {{ Number(rippleSpeed).toFixed(1) }}
          </label>
        </div>

        <button @click="createManualRipple" class="button">
          Create Random Ripple
        </button>

        <div class="navigation">
          <NuxtLink to="/" class="home-link">
            Back to Home
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import useRippleBackground from '../composables/useRippleBackground';

// Get ripple background composable
const { create, cleanup, addRipple } = useRippleBackground();

// Background container reference
const backgroundContainer = ref<HTMLElement | null>(null);

// Customization options
const colors = ref({
  start: '#4158D0',
  middle: '#C850C0',
  end: '#FFCC70'
});
const grainAmount = ref('0.05');
const rippleSpeed = ref('1.0');

// Create manual ripple at random position
function createManualRipple() {
  if (!backgroundContainer.value) return;

  const containerRect = backgroundContainer.value.getBoundingClientRect();
  const x = Math.random() * containerRect.width;
  const y = Math.random() * containerRect.height;

  addRipple(x, y);
}

// Update background with new settings
function updateBackground() {
  if (!backgroundContainer.value) return;

  // Create new instance with updated settings
  create('.background-container', {
    colorStart: colors.value.start,
    colorMiddle: colors.value.middle,
    colorEnd: colors.value.end,
    grainAmount: Number(grainAmount.value),
    rippleSpeed: Number(rippleSpeed.value)
  });
}

onMounted(() => {
  // Wait for the DOM to be fully rendered
  nextTick(() => {
    // Initialize ripple background
    create('.background-container', {
      colorStart: colors.value.start,
      colorMiddle: colors.value.middle,
      colorEnd: colors.value.end,
      grainAmount: Number(grainAmount.value),
      rippleSpeed: Number(rippleSpeed.value)
    });
  });
});

onBeforeUnmount(() => {
  // Clean up ripple background
  cleanup();
});
</script>

<style scoped>
.ripple-demo {
  min-height: 100vh;
  position: relative;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.background-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.content {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.title {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.description {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.controls {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
}

.control-group {
  margin-bottom: 1rem;
}

label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

input[type="color"] {
  border: none;
  border-radius: 4px;
  width: 40px;
  height: 30px;
  cursor: pointer;
}

input[type="range"] {
  flex: 1;
}

.button {
  background-color: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1rem;
}

.button:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.navigation {
  margin-top: 1.5rem;
  text-align: center;
}

.home-link {
  color: white;
  text-decoration: none;
  font-size: 1.1rem;
  transition: opacity 0.2s;
}

.home-link:hover {
  opacity: 0.8;
}
</style>