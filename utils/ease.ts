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


