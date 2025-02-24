import type {FlutiUser} from "$lib/fluti/server/serverTypes";
import type {OAuthEvent, OAuthProviderValidate} from "$lib/fluti/server/middlewares/oauth/oAuthTypes";

export interface UserLoginRequest {
    login: string
    password: string
}

export interface OAuthMiddlewareOptions {

    //default: validate oauth request
    onAuthEvent: OAuthProviderValidate

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

export interface SessionMiddlewareConfig {

    /**
     * after successful session validation it decrypts token
     * and add to context token content
     *
     * default: user
     */
    contextPropertyName: string

    onUserLogin(request: UserLoginRequest): Promise<boolean>

    /**
     * When using [token.useServerCache=true] this method will run only once and again when cache get cleaned
     * @param tokenPayload
     */
    onTokenToUserMapping(tokenPayload: any): Promise<any>

    onDefaultUserData(): Promise<FlutiUser>

    token: {
        useServerCache: boolean
        /**
         * Set name of the cookie in which token will be stored
         */
        cookieName: string

        /**
         * Time in milliseconds after with token get expired
         *
         * default: 7 days
         */
        tokenExpirationTime: number
        secret: string
    }

    api: {
        /**
         * default: /auth
         */
        endpointPrefix: string
    }

    /**
     * default: api/auth/oauth/:providerName
     */
    oAuth: OAuthMiddlewareOptions
}

export type SessionMiddlewareConfigFn = (config: SessionMiddlewareConfig) => void