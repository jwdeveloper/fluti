import {MediaQuery} from "svelte/reactivity";
import {useServerRenderConfig} from "$lib/fluti/components/panel/ServerRenderConfig";


export class BreakpointController {

    xsm = new MediaQuery('min-width: 480px', true);
    sm = new MediaQuery('max-width: 600px', true);
    md = new MediaQuery('min-width: 768px', true);
    lg = new MediaQuery('min-width: 1024px', true);
    xl = new MediaQuery('min-width: 1280px', true);
    xxl = new MediaQuery('min-width: 1440px', true);

    isMobile = $derived.by(() => {
        if (useServerRenderConfig?.serverSide === true)
            return useServerRenderConfig.isMobile;

        console.log('checking if mobile',(!this.isTablet && !this.isDesktop) )
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

    width = $state(0)
}

export let breakpoints: BreakpointController = new BreakpointController();
