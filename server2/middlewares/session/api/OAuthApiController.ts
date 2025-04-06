import type {SessionMiddlewareConfig,} from "$lib/fluti/server2/middlewares/session/SessionMiddlewareTypes";

import {type Context, Hono} from "hono";
import {deleteCookie, getCookie, setCookie} from "hono/cookie";
import {returnUserAuthTokens} from "$lib/fluti/server2/middlewares/session/service/userService";
import {pocketbaseClient} from "$lib/fluti/clients/pocketbase-client";

export function createOAuthApiController(config: SessionMiddlewareConfig) {
    const options = config.oAuth;
    const controller = new Hono();

    controller.get("/oauth/create/:provider", async (c: Context) => {
        const provider = c.req.param().provider;
        const authProviders = await pocketbaseClient.collection('users').listAuthMethods();
        if (!authProviders.oauth2.enabled)
            throw new Error("OAuth disabled!")

        const oauthProvider = authProviders.oauth2
            .providers
            .find(e => e.name === provider.toLowerCase())
        if (!oauthProvider)
            throw new Error("OAuth provider " + provider + " not found!")

        const authUrl = oauthProvider.authURL;
        const state = oauthProvider.state;
        const verifier = oauthProvider.codeVerifier;
        const url = new URL(c.req.url);
        const redirectUrl = `${url.protocol}//${url.host}/api/auth/oauth/${provider.toLowerCase()}`;
        setCookie(c, 'oauth_state', encodeURIComponent(state), {
            path: '/',
            secure: true,
            sameSite: 'lax',
            httpOnly: true // Consider adding this for security
        });

        setCookie(c, 'oauth_verifier', encodeURIComponent(verifier), {
            path: '/',
            secure: true,
            sameSite: 'lax',
            httpOnly: true // Consider adding this for security
        });


        // let fullUrl = `${authUrl}${encodeURIComponent(redirectUrl)}`;
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
        if (!expectedState)
            return c.text(`cookie '${verifierCookie}' not found`)


        const state = c.req.query("state") ?? '';
        const code = c.req.query("code") ?? '';
        if (state !== expectedState) {
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
            let user = await options.onAuthEvent(oAuthSgnData)
            deleteCookie(c, verifierCookie);
            deleteCookie(c, stateCookie);
            await returnUserAuthTokens(c, config, '', user)
        } catch (e) {
            console.log('Error Signing in with oauth', {...oAuthSgnData, request: ""})
            console.log(e)
            return c.redirect(failedRedirect);
        }
        return c.redirect(successRedirect);
    })

    return controller;
}