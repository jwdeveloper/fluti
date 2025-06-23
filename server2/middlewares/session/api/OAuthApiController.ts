import type {
    OAuthMiddlewareOptions,
    SessionMiddlewareConfig,
} from "$lib/fluti/server2/middlewares/session/SessionMiddlewareTypes";

import {type Context, Hono} from "hono";
import {deleteCookie, getCookie, setCookie} from "hono/cookie";
import {returnUserAuthTokens} from "$lib/fluti/server2/middlewares/session/service/userService";
import {pocketbaseClient} from "$lib/fluti/clients/pocketbase-client";
import {pocketbaseClientAdmin} from "$lib/fluti/clients/pocketbase-client-admin";
import type {OAuthEvent} from "$lib/fluti/server/middlewares/oauth/oAuthTypes";
import {handleMicrosoftOAuth} from "$lib/fluti/server2/middlewares/session/api/handles/MicrosoftHandler";


export function makeOAuthOpenSelectUser(authUrl: string, provider: string): string {
// Parse the authorization URL into base and query parts
    const [baseUrl, queryString] = authUrl.split("?");

    let option = undefined
    switch (provider.toLowerCase()) {
        case 'google':
            // Google uses prompt=select_account

            option = "prompt=select_account"
            break;

        case 'discord':
            // Discord uses prompt=consent
            option = "prompt=consent"
            break;

        case 'microsoft':

            option = "prompt=select_account"
            break;

        case 'github':
            // GitHub doesn't support a direct parameter, but you can use login parameter
            // to clear the session and force a re-login
            option = "login="
            break;

        case 'apple':
            // Apple uses response_mode=form_post and response_type=code id_token
            option = "response_mode=form_post&response_type=code id_token"
            break;
    }
    if (!option)
        return authUrl;

    return `${baseUrl}?${option}&${queryString}`;
}

export function createOAuthApiController(config: SessionMiddlewareConfig) {
    const options = config.oAuth;
    const controller = new Hono();

    controller.get("/oauth/create/:provider", async (c: Context) => {
        const provider = c.req.param().provider;

        let oauthProvider = await config.oAuth.onAuthFindProvider(provider);
        let authUrl = oauthProvider.authURL;
        const state = oauthProvider.state;
        const verifier = oauthProvider.codeVerifier;
        const url = new URL(c.req.url);
        const redirectUrl = `${url.protocol}//${url.host}/api/auth/oauth/${provider.toLowerCase()}`;


        authUrl = makeOAuthOpenSelectUser(authUrl, provider);


        setCookie(c, 'oauth_state', encodeURIComponent(state), {
            path: '/',
            secure: true,
            sameSite: 'lax',
            httpOnly: true,
            maxAge: 600
        });

        setCookie(c, 'oauth_verifier', encodeURIComponent(verifier), {
            path: '/',
            secure: true,
            sameSite: 'lax',
            httpOnly: true,
            maxAge: 600

        });

        let fullUrl = `${authUrl}${encodeURIComponent(redirectUrl)}`;
        if (provider.toLowerCase() === 'github') {
            fullUrl = fullUrl.replace("redirect_uri", '')
        }
        return c.json({
            url: fullUrl
        });
    })

    controller.get("/oauth/:provider", async (c: Context) => {
        const failedRedirect = options.failRedirect ?? '/login';
        const successRedirect = options.successRedirect ?? '/';

        const stateCookie = options.stateCookie ?? "oauth_state";
        const verifierCookie = options.verifierCookie ?? "oauth_verifier";
        const provider = c.req.param().provider;

        const url = new URL(c.req.url);
        const redirect = `${url.protocol}//${url.host}${config.api.endpointPrefix}/oauth/${provider}`;
        const expectedState = getCookie(c, stateCookie) ?? '';
        if (!expectedState)
            return c.text(`cookie '${stateCookie}' not found`)

        const expectedVerifier = getCookie(c, verifierCookie) ?? '';
        if (!expectedVerifier)
            return c.text(`cookie '${verifierCookie}' not found`)


        const state = c.req.query("state") ?? '';
        const code = c.req.query("code") ?? '';
        if (state !== decodeURIComponent(expectedState)) {
            console.log("State mismatch", state, " and ", expectedState);
            return c.redirect(failedRedirect);
        }


        let oAuthSgnData = {
            provider: provider,
            redirect: redirect,
            verifier: expectedVerifier,
            code: code,
            request: c
        }
        try {
            let user = await handleOAuthEvent(options, oAuthSgnData);
            deleteCookie(c, verifierCookie);
            deleteCookie(c, stateCookie);
            await returnUserAuthTokens(c, config, '', user)
        } catch (e) {
            // console.log('Error Signing in with oauth', {...oAuthSgnData, request: ""})
            //@ts-ignore
            console.log(e, JSON.stringify(e))
            return c.redirect(failedRedirect + "?error=oAuth2");
        }
        return c.redirect(successRedirect);
    })
    return controller;
}

async function handleOAuthEvent(options: OAuthMiddlewareOptions, event: OAuthEvent) {
    return await options.onAuthEvent(event)
}