import type {FlutiServer2Middleware} from "$lib/fluti/server2/flutiServer2Types";
import type {Hono} from "hono";
import type {
    SessionMiddlewareConfig,
    SessionMiddlewareConfigFn,
    UserLoginRequest
} from "$lib/fluti/server2/middlewares/session/SessionMiddlewareTypes";
import {
    createLoginWithHeadersMiddleware,
    createSessionApiController,
    createSessionAuthMiddleware,
} from "$lib/fluti/server2/middlewares/session/api/SessionApiController";
import {createOAuthApiController} from "$lib/fluti/server2/middlewares/session/api/OAuthApiController";
import {
    handlePocketBaseOAuth,
    handlePocketBaseOAuthFind
} from "$lib/fluti/server2/middlewares/session/pocketbaseOAuthHandler";
import {JWT_TOKEN_SECRET} from "$env/static/private";

async function pocketbaseUserLogin(request: UserLoginRequest) {
    return false;
}

export function useSessionMiddleware(onConfig: SessionMiddlewareConfigFn): FlutiServer2Middleware {
    return (serverConfig) => {
        const config: SessionMiddlewareConfig = {
            contextPropertyName: 'user',
            onUserLogin: pocketbaseUserLogin,
            onTokenToUserMapping: (e) => e,
            onDefaultUserData: async () => {
                return {
                    id: '',
                    email: 'guest',
                    verified: false,
                    guest: true,
                    admin: false,
                    country: '',
                    login: 'guest',
                    permissions: [],
                    claims: {},
                    roles: [],
                    profile: {}
                }
            },
            oAuth: {
                onAuthEvent: handlePocketBaseOAuth,
                onAuthFindProvider: handlePocketBaseOAuthFind
            },
            api: {
                endpointPrefix: '/api/auth'
            },
            token: {
                cookieName: 'session_token',
                useServerCache: true,
                secret: JWT_TOKEN_SECRET,
                tokenExpirationTime: 60 * 60 * 60 * 30,
            },
        }
        if (onConfig)
            onConfig(config)

        if (config?.token?.secret === undefined || config?.token?.secret === '') {
            console.error("[ERROR AND WARNING] env variable JWT_TOKEN_SECRET is empty! Make sure fill its data otherwise login page will not working!")
        }
        const app: Hono = serverConfig.app;
        app.use(createLoginWithHeadersMiddleware(config));
        app.use(createSessionAuthMiddleware(config));
        app.route(config.api.endpointPrefix, createSessionApiController(config));
        if (config?.oAuth !== undefined) {
            app.route(config.api.endpointPrefix, createOAuthApiController(config))
        }

    }
}