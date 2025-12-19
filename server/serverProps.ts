import {useServerRenderConfig} from "$lib/fluti/components/panel/ServerRenderConfig.svelte";
import type {RequestEvent} from "@sveltejs/kit";

export function returnServerProps(event: RequestEvent) {
    const isUserLogin = event.cookies.get("session_token") !== undefined;

    useServerRenderConfig.checkIfMobile(event);

    const isProd = import.meta.env.PROD;
    let url = event.url.toString();
    let domain = event.url.origin;

    if (isProd) {
        if (process?.env?.DOMAIN && process?.env?.DOMAIN.includes('https')) {
            url = url.replace(/^http:\/\//, "https://");
            domain = domain.replace(/^http:\/\//, "https://");
        }
    }
    console.log('server props', {
        url,
        isUser: isUserLogin,
        domain,
        route: event.url.pathname
    })

    return {
        url,
        isUser: isUserLogin,
        domain,
        route: event.url.pathname
    };
}