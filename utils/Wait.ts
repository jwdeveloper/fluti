import {tick} from "svelte";

export async function waitTick(callback: () => void, ticks?: number) {
    if (ticks === undefined)
        ticks = 1;

    for (let i = 0; i < ticks; i++) {
        await tick();
    }
    callback();
}

export async function wait(milliseconds: any) {
    if (typeof milliseconds === "number") {
        return new Promise(resolve => {
            setTimeout(resolve, milliseconds);
        });
    }
    return all(milliseconds)
}

export async function all(fn: any, time?: any, delay?: any) {

    if (delay !== undefined) {
        await wait(delay)
    }
    if (time === undefined)
        time = 600;

    await fn();
    await wait(time)
}

export function getCurrentTime() {
    return new Date().toISOString();
}

export function generateUUID() { // Public Domain/MIT
    let d = new Date().getTime();//Timestamp
    let d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16;//random number between 0 and 16
        if (d > 0) {//Use timestamp until depleted
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

export function vibrate() {
    if (navigator && navigator?.vibrate)
        navigator?.vibrate(25);

}