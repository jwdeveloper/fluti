import {MediaQuery} from "svelte/reactivity";
import {useServerRenderConfig} from "$lib/fluti/components/panel/ServerRenderConfig.svelte";


export class BreakpointController {

    xsm = new MediaQuery('min-width: 480px', true);
    sm = new MediaQuery('max-width: 600px', true);
    md = new MediaQuery('min-width: 768px', true);
    lg = new MediaQuery('min-width: 1024px', true);
    xl = new MediaQuery('min-width: 1280px', true);
    xxl = new MediaQuery('min-width: 1440px', true);

    width = $state(0)
    isMobile = $derived.by(() => {
        if (useServerRenderConfig.serverSide) {
            return useServerRenderConfig.isMobile;
        }
        return !this.isTablet && !this.isDesktop;
    });
    isTablet = $derived.by(() => {
        return this.md.current && !this.isDesktop;
    });
    isDesktop = $derived.by(() => {
        if (useServerRenderConfig?.serverSide === true)
            return !useServerRenderConfig.isMobile;

        return this.lg.current;
    });
}

export let breakpoints: BreakpointController = new BreakpointController();

let counter = 0;

export function setCounter(num: number) {
    counter = num;
}

export function getCounter() {
    return counter;
}


export function resetBreakpointServerSide() {
    breakpoints = new BreakpointController()
}