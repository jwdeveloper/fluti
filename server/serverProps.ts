import { useServerRenderConfig } from "$lib/fluti/components/panel/ServerRenderConfig.svelte";
import type { RequestEvent } from "@sveltejs/kit";

export function returnServerProps(event: RequestEvent) {
    const isProd = process.env.NODE_ENV === "production";
    const isUserLogin = event.cookies.get("session_token") !== undefined;

    useServerRenderConfig.checkIfMobile(event);

    let url = event.url.toString();
    let domain = event.url.origin;

    // Enforce HTTPS in production
    if (isProd) {
        url = url.replace(/^http:\/\//, "https://");
        domain = domain.replace(/^http:\/\//, "https://");
    }

    return {
        url,
        isUser: isUserLogin,
        domain,
        route: event.url.pathname
    };
}