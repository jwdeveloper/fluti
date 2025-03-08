import type {RequestEvent} from "@sveltejs/kit";
import {breakpoints} from "$lib/fluti/widgets/breakpoints/breakpointsImpl.svelte";

export class ServerRenderConfig {
    isMobile: boolean = false
    serverSide: boolean = false

    checkIfMobile(event: RequestEvent) {

        const userAgent = event?.request?.headers?.get('user-agent');
        if (userAgent !== undefined) {
            useServerRenderConfig.isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(userAgent);
            useServerRenderConfig.serverSide = true
        } else {
            useServerRenderConfig.serverSide = false
        }
        console.log("server config", useServerRenderConfig)
    }
}

let instance = new ServerRenderConfig();
export const useServerRenderConfig = instance;