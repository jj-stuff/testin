/**
 * Creates a grainy gradient background with mouse-based ripple effects
 *
 * @param {string} selector - CSS selector for the container element
 * @param {Object} options - Configuration options
 * @returns {Object} - Interface with cleanup method
 */

interface RippleOptions {
  colorStart?: string;
  colorMiddle?: string;
  colorEnd?: string;
  rippleColor?: string;
  grainAmount?: number;
  maxRipples?: number;
  rippleSpeed?: number;
  rippleMinDistance?: number;
  rippleInterval?: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
  opacity: number;
}

interface RippleBackground {
  cleanup: () => void;
  addRipple: (x: number, y: number) => void;
}

export default function createRippleBackground(
    selector: string,
    options: RippleOptions = {}
): RippleBackground {
  // Default options
  const config = {
    colorStart: options.colorStart || '#4158D0',
    colorMiddle: options.colorMiddle || '#C850C0',
    colorEnd: options.colorEnd || '#FFCC70',
    rippleColor: options.rippleColor || 'rgba(255, 255, 255, 0.3)',
    grainAmount: options.grainAmount || 0.05,
    maxRipples: options.maxRipples || 20,
    rippleSpeed: options.rippleSpeed || 1,
    rippleMinDistance: options.rippleMinDistance || 20,
    rippleInterval: options.rippleInterval || 100
  };

  // Get the container element
  const container = document.querySelector(selector) as HTMLElement;
  if (!container) {
    console.error(`Element not found: ${selector}`);
    return {
      cleanup: () => {},
      addRipple: () => {}
    };
  }

  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.className = 'ripple-background-canvas';
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.zIndex = '-10';
  canvas.style.pointerEvents = 'none'; // Don't interfere with interactions
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;

  // Add canvas to container
  container.style.position = container.style.position || 'relative';
  container.appendChild(canvas);

  // Get context
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  // State variables
  let width = canvas.width;
  let height = canvas.height;
  let ripples: Ripple[] = [];
  let animationFrameId: number;
  let mouseX = 0, mouseY = 0;
  let lastMouseX = 0, lastMouseY = 0;
  let lastRippleTime = 0;
  let grainTexture: HTMLCanvasElement;

  // Create grain texture
  function createGrainTexture(): HTMLCanvasElement {
    const size = 256;
    const grainCanvas = document.createElement('canvas');
    grainCanvas.width = size;
    grainCanvas.height = size;

    const grainCtx = grainCanvas.getContext('2d') as CanvasRenderingContext2D;
    const imageData = grainCtx.createImageData(size, size);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const value = Math.random() * 30;
      data[i] = value;     // r
      data[i + 1] = value; // g
      data[i + 2] = value; // b
      data[i + 3] = Math.random() * 255 * config.grainAmount;  // alpha
    }

    grainCtx.putImageData(imageData, 0, 0);
    return grainCanvas;
  }

  // Create a ripple
  function createRipple(x: number, y: number): void {
    const ripple: Ripple = {
      x,
      y,
      radius: 0,
      maxRadius: Math.min(width, height) * (0.1 + Math.random() * 0.2),
      speed: config.rippleSpeed * (0.5 + Math.random()),
      opacity: 1
    };

    ripples.push(ripple);

    // Limit ripples
    if (ripples.length > config.maxRipples) {
      ripples.shift();
    }
  }

  // Draw gradient background
  function drawBackground(): void {
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, config.colorStart);
    gradient.addColorStop(0.5, config.colorMiddle);
    gradient.addColorStop(1, config.colorEnd);

    // Fill background
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Apply grain
    ctx.globalCompositeOperation = 'overlay';
    ctx.drawImage(grainTexture, 0, 0, width, height);
    ctx.globalCompositeOperation = 'source-over';
  }

  // Handle mouse movement
  function handleMouseMove(e: MouseEvent): void {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;

    // Check if mouse has moved enough and time passed
    const now = Date.now();
    const dx = mouseX - lastMouseX;
    const dy = mouseY - lastMouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > config.rippleMinDistance && now - lastRippleTime > config.rippleInterval) {
      createRipple(mouseX, mouseY);
      lastMouseX = mouseX;
      lastMouseY = mouseY;
      lastRippleTime = now;
    }
  }

  // Handle window resize
  function handleResize(): void {
    width = container.clientWidth;
    height = container.clientHeight;

    canvas.width = width;
    canvas.height = height;
  }

  // Animation loop
  function animate(): void {
    animationFrameId = requestAnimationFrame(animate);

    // Clear canvas and draw background
    ctx.clearRect(0, 0, width, height);
    drawBackground();

    // Update and draw ripples
    for (let i = ripples.length - 1; i >= 0; i--) {
      const ripple = ripples[i];

      // Update ripple
      ripple.radius += ripple.speed;
      ripple.opacity = 1 - (ripple.radius / ripple.maxRadius);

      // Remove if too large or invisible
      if (ripple.opacity <= 0) {
        ripples.splice(i, 1);
        continue;
      }

      // Draw ripple
      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
      ctx.strokeStyle = config.rippleColor.replace(
          /[\d.]+\)$/g,
          `${ripple.opacity.toFixed(2)})`
      );
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  // Initialize
  function init(): void {
    grainTexture = createGrainTexture();

    // Add event listeners
    window.addEventListener('resize', handleResize);
    container.addEventListener('mousemove', handleMouseMove);

    // Start animation
    animate();
  }

  // Cleanup function
  function cleanup(): void {
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener('resize', handleResize);
    container.removeEventListener('mousemove', handleMouseMove);

    if (canvas && canvas.parentNode) {
      canvas.parentNode.removeChild(canvas);
    }
  }

  // Initialize
  init();

  // Return interface
  return {
    cleanup,
    // Add a ripple programmatically
    addRipple: (x: number, y: number) => createRipple(x, y)
  };
}