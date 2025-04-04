import type {RequestEvent} from "@sveltejs/kit";

import type {SessionMiddlewareOptions} from "$lib/fluti/server/middlewares/sessionMiddleware";
import type {RouteMiddlewareOptions} from "$lib/fluti/server/middlewares/route/routeMiddleware";
import type {OAuthMiddlewareOptions} from "$lib/fluti/server/middlewares/oauth/oAuthTypes";
import type {ApiMiddlewareOptions} from "$lib/fluti/server/middlewares/api/apiMiddleware";
import type {Context, Next} from "hono";

export type OneOrMore<T> = T | [T, ...T[]] | T[]


export type HonoMiddleware = (context: Context, next: Next) => Promise<void | Response>

export type FlutiUser = {
    id: string,
    admin?: boolean,
    email?: string,
    login?: string,
    verified: boolean
    permissions: string[]
    roles: string[]
    country?: string
    profile?: {
        name?: string,
        firstName?: string,
        lastName?: string,
        picture?: string,
    }
    claims: Record<string, string>
}

export interface FlutiServerBuilder {

    /**
     *
     * @param handler
     */
    use(handler: FlutiServerMiddleware): FlutiServerBuilder

    /**
     *
     * @param options
     */
    useOAuth(options: OAuthMiddlewareOptions): FlutiServerBuilder

    /**
     *
     * @param options
     */
    useApi(options: ApiMiddlewareOptions): FlutiServerBuilder

    /**
     *
     * @param options
     */
    useSession(options?: SessionMiddlewareOptions): FlutiServerBuilder

    /**
     *
     * @param options
     */
    useRoutes(options?: RouteMiddlewareOptions): FlutiServerBuilder

    /**
     *
     * @param options
     */
    useRatelimit(options?: RouteMiddlewareOptions): FlutiServerBuilder

    /**
     *
     * @param options
     */
    useCountryBlocker(options?: RouteMiddlewareOptions): FlutiServerBuilder

    /**
     * Creates instance of server with all applied middlewares
     */
    create(): FlutiServer
}

export type FlutiServerMiddleware = (event: RequestEvent, next?: any) =>
    Promise<Response> | void | string | object;


export interface FlutiServer {
    handle(event: RequestEvent, handler: any): Promise<Response>;
}

export interface FlutiServerOptions {
    middlewares: any[]
    errorMiddleware: any
}