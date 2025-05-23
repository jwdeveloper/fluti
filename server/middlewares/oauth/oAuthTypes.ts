import type {FlutiUser} from "$lib/fluti/server/serverTypes";
import type {Context} from "hono";


export type OAuthEvent = {
    provider: string,
    redirect: string,
    verifier: string,
    code: string,
    request: Context
}

export type OAuthProviderValidate = (event: OAuthEvent) => Promise<FlutiUser>

export interface OAuthMiddlewareOptions {

    //default: validate oauth request
    onRequest: OAuthProviderValidate

    //default: 'oauth_state'
    stateCookie?: string

    //default: 'oauth_verifier'
    verifierCookie?: string

    //default login
    failRedirect?: string

    //default /
    successRedirect?: string

    //default /oauth:provider
    route?: string
}