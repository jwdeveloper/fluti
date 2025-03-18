import {animatedElement} from "$lib/fluti/effects/animations/AnimatedElement";


let defaultFrames = [
    {scale: .8, time: 100},
    {scale: 1.1, time: 120},
    {scale: 1, time: 120},
]

// defaultFrames = [{scale:0.9,time:100},{scale:1.1,time:100},{scale:1.02,time:100},{scale:1.05,time:100}]

export function addClickEffect(element: HTMLElement, frames?: any[]) {
    let fun = () => invokeClickEffect(element, frames ?? defaultFrames);
    element.addEventListener('mousedown', fun);
    return () => {
        element.removeEventListener('mousedown', fun);
    };
}

export async function invokeClickEffect(element: HTMLElement, frames: any[]) {
    let ae = animatedElement(element);
    let initScale = ae.style.scale;
    for (let frame of frames) {
        await ae.scale(frame.scale, frame.time)
    }
    ae.scale(initScale)
}