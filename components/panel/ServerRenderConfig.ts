import type {RequestEvent} from "@sveltejs/kit";
import {breakpoints} from "$lib/fluti/widgets/breakpoints/breakpointsImpl.svelte";

export class ServerRenderConfig {
    isMobile: boolean = false
    serverSide: boolean = false

    checkIfMobile(event: RequestEvent) {
        const userAgent = event.request.headers.get('user-agent') ?? '';
        useServerRenderConfig.isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(userAgent);
        useServerRenderConfig.serverSide = true
        breakpoints.isServerMobile = useServerRenderConfig.serverSide;
    }
}

let instance = new ServerRenderConfig();
export const useServerRenderConfig = instance;