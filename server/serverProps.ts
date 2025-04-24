import {useServerRenderConfig} from "$lib/fluti/components/panel/ServerRenderConfig.svelte";
import type {RequestEvent} from "@sveltejs/kit";

export function returnServerProps(event: RequestEvent) {
    useServerRenderConfig.checkIfMobile(event)
    return {
        url: event.url.toString(),
        domain: event.url.origin
    }
}