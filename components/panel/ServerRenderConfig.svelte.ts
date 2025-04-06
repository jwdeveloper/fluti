import type {RequestEvent} from "@sveltejs/kit";
import {resetBreakpointServerSide} from "$lib/fluti/widgets/breakpoints/breakpointsImpl.svelte";

export class ServerRenderConfig {
    isMobile: boolean = $state(false)
    serverSide: boolean = $state(false)

    checkIfMobile(event: RequestEvent) {

        resetBreakpointServerSide();
        const userAgent = event?.request?.headers?.get('user-agent');
        if (userAgent !== undefined) {
            useServerRenderConfig.serverSide = true
            useServerRenderConfig.isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(userAgent);
        } else {
            useServerRenderConfig.serverSide = false
        }
    }
}

let instance = new ServerRenderConfig();
export const useServerRenderConfig = instance;