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

type Pos = { x: number; y: number };

let currentAnimation: { cancel: () => void } | null = null;

export function animateToPosition(
    from: Pos,
    to: Pos,
    onUpdate: (pos: Pos) => void,
    duration = 400,
    easeFun=easeFunction.quadOut()

): Promise<void> {

    // if (currentAnimation) {
    //     currentAnimation.cancel();
    // }

    return new Promise((resolve) => {
        const startX = from.x;
        const startY = from.y;
        const deltaX = to.x - startX;
        const deltaY = to.y - startY;
        const startTime = performance.now();
        let canceled = false;

        let timeout = setTimeout(() => {
            if (!canceled) {
                canceled = true;
                currentAnimation = null;
                resolve(); // resolve to avoid stuck promises
            }
        }, duration + 100); // 100ms buffer



        function step(time: number) {
            if (canceled) return;

            const elapsed = time - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeFun(progress);

            onUpdate({
                x: startX + deltaX * eased,
                y: startY + deltaY * eased,
            });

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                clearTimeout(timeout);
                currentAnimation = null;
                resolve();
            }
        }

        currentAnimation = {
            cancel: () => {
                canceled = true;
                clearTimeout(timeout);
                currentAnimation = null;
            }
        };

        requestAnimationFrame(step);
    });
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


