import {useServerRenderConfig} from "$lib/fluti/components/panel/ServerRenderConfig.svelte";
import type {RequestEvent} from "@sveltejs/kit";

export function returnServerProps(event: RequestEvent) {
    let isUserLogin = event.cookies.get('session_token') !== undefined
    useServerRenderConfig.checkIfMobile(event)
    return {
        url: event.url.toString(),
        isUser: isUserLogin,
        domain: event.url.origin,
        route: event.url.pathname
    }
}