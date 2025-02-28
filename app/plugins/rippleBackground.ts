import { ref } from 'vue';
import createRippleBackground from '../utils/rippleBackground.ts';

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

interface RippleBackground {
    cleanup: () => void;
    addRipple: (x: number, y: number) => void;
}

export default function rippleBackground() {
    const instance = ref<RippleBackground | null>(null);

    /**
     * Create a ripple background effect on an element
     */
    const create = (selector: string, options: RippleOptions = {}): RippleBackground | null => {
        // Only run on client side
        if (process.client) {
            // Clean up any existing instance
            if (instance.value) {
                instance.value.cleanup();
            }

            // Create new instance
            const rippleBackground = createRippleBackground(selector, options);
            instance.value = rippleBackground;
            return rippleBackground;
        }

        return null;
    };

    /**
     * Clean up the ripple background instance
     */
    const cleanup = () => {
        if (instance.value) {
            instance.value.cleanup();
            instance.value = null;
        }
    };

    /**
     * Add a ripple at a specific position
     */
    const addRipple = (x: number, y: number) => {
        if (instance.value) {
            instance.value.addRipple(x, y);
        }
    };

    return {
        create,
        cleanup,
        addRipple
    };
}