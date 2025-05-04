import {
    backIn,
    backInOut,
    backOut,
    bounceIn,
    bounceInOut,
    bounceOut,
    circIn,
    circInOut,
    circOut,
    cubicIn,
    cubicInOut,
    cubicOut,
    elasticIn,
    elasticInOut,
    elasticOut,
    expoIn,
    expoInOut,
    quadIn,
    quadInOut,
    quadOut
} from 'svelte/easing';

export type Pos = { x: number; y: number }

export function animateToPosition(from: Pos,
                                  to: Pos,
                                  onUpdate: (pos: Pos) => void,
                                  duration = 400) {
    const startX = from.x;
    const startY = from.y;
    const deltaX = to.x - startX;
    const deltaY = to.y - startY;
    const startTime = performance.now();

    function easeOutQuad(t: number) {
        return t * (2 - t);
    }

    function step(time: number) {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutQuad(progress);
        const pos = {
            x: startX + deltaX * eased,
            y: startY + deltaY * eased
        }
        onUpdate(pos)
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}

export class EaseFunctions {
    backIn() {
        return backIn;
    }

    backInOut() {
        return backInOut;
    }

    backOut() {
        return backOut;
    }

    bounceIn() {
        return bounceIn;
    }

    bounceInOut() {
        return bounceInOut;
    }

    bounceOut() {
        return bounceOut;
    }

    circIn() {
        return circIn;
    }

    circInOut() {
        return circInOut;
    }

    circOut() {
        return circOut;
    }

    cubicIn() {
        return cubicIn;
    }

    cubicInOut() {
        return cubicInOut;
    }

    cubicOut() {
        return cubicOut;
    }

    elasticIn() {
        return elasticIn;
    }

    elasticInOut() {
        return elasticInOut;
    }

    elasticOut() {
        return elasticOut;
    }

    expoIn() {
        return expoIn;
    }

    expoInOut() {
        return expoInOut;
    }

    quadInOut() {
        return quadInOut;
    }

    quadOut() {
        return quadOut;
    }

    quadIn() {
        return quadIn;
    }
}

export const easeFunction: EaseFunctions = new EaseFunctions();


