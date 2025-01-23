import {animatedElement} from "$lib/fluti/effects/animations/AnimatedElement";


export function addClickEffect(element: HTMLElement) {
    let fun = () => invokeClickEffect(element);
    element.addEventListener('mousedown', fun);
    return () => {
        element.removeEventListener('mousedown', fun);
    };
}

export async function invokeClickEffect(element: HTMLElement) {
    let ae = animatedElement(element);
    await ae.scale(.8, 100)
    await ae.scale(1.1, 120)
    await ae.scale(1, 120)
}