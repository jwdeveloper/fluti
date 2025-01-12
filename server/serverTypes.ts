import type {RequestEvent} from "@sveltejs/kit";
import type {SessionMiddlewareOptions} from "$lib/fluti/server/middlewares/sessionMiddleware";
import type {RouteMiddlewareOptions} from "$lib/fluti/server/middlewares/route/routeMiddleware";

export type OneOrMore<T> = T | [T, ...T[]]

export type FlutiUserSession = {

    email?: string,
    login?: string,
    verified: boolean
    permissions: string[]
    roles: string[]
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