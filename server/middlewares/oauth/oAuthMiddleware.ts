import type {OAuthMiddlewareOptions, OAuthProviderValidate} from "$lib/fluti/server/middlewares/oauth/oAuthTypes";

import type {FlutiServerMiddleware} from "$lib/fluti/server/serverTypes";
import type {RequestEvent} from "@sveltejs/kit";
import {redirectTo} from "$lib/fluti/utils/httpUtils";


export function useOAuthMiddleware(options: OAuthMiddlewareOptions): FlutiServerMiddleware {

    const failedRedirect = options.failRedirect ?? '/login';
    const successRedirect = options.successRedirect ?? '/';

    const stateCookie = options.stateCookie ?? "oauth_state";
    const verifierCookie = options.verifierCookie ?? "oauth_verifier";

    let route = options.route ?? "/oauth";

    return async (event: RequestEvent, handle: any) => {

        if (event.url.pathname === route)
            return `OAuth provider is not specified. Example: ${route}/google`

        if (!event.url.pathname.startsWith(route))
            return

        let provider = event.url.pathname.replace(route, "");
        provider = provider.replace("/", "");

        const redirect = `${event.url.origin}${route}/${provider}`;
        const expectedState = event.cookies.get(stateCookie) ?? '';
        if (!expectedState)
            return `cookie '${stateCookie}' not found`

        const expectedVerifier = event.cookies.get(verifierCookie) ?? '';
        if (!expectedState)
            return `cookie '${verifierCookie}' not found`

        const state = event.url.searchParams.get('state') ?? '';
        const code = event.url.searchParams.get('code') ?? '';

        if (state !== expectedState) {
            console.log("State mismatch", state, " and ", expectedState);
            return redirectTo(failedRedirect);
        }
        try {
            let user = await options.onRequest({
                provider: provider,
                redirect: redirect,
                verifier: expectedVerifier,
                code: code,
                request: event
            })
            event.cookies.delete(verifierCookie, {path: '/'});
            event.cookies.delete(stateCookie, {path: '/'});
            event.cookies.set('user', JSON.stringify(user), {path: '/', httpOnly: false});
        } catch (e) {
            console.log('Error Signing in with oauth', e)
            return redirectTo(failedRedirect);
        }
        return redirectTo(successRedirect);
    }
}

