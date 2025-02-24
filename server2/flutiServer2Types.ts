import type {RequestEvent, ResolveOptions} from "@sveltejs/kit";
import type {ApiMiddlewareConfigFn} from "$lib/fluti/server2/middlewares/api/ApiMiddlewareTypes";
import type {Hono} from "hono";
import type {SessionMiddlewareConfigFn} from "$lib/fluti/server2/middlewares/session/SessionMiddlewareTypes";

export interface FlutiServer2Builder {

    configure(onConfig: (config: FlutiServer2Config) => void): FlutiServer2Builder

    use(middleware: FlutiServer2Middleware): FlutiServer2Builder

    useApi(onConfig: ApiMiddlewareConfigFn): FlutiServer2Builder

    useSession(onConfig?: SessionMiddlewareConfigFn): FlutiServer2Builder

    useAuthorization(): FlutiServer2Builder

    create(): FlutiServer2
}

export interface FlutiServer2 {
    handel(event: RequestEvent, resolve: (event: RequestEvent, opts?: ResolveOptions) => any): any
}

export type FlutiServer2Middleware = (config: FlutiServer2Config) => void;

export interface FlutiServer2Config {

    /**
     * instance of Hono app
     */
    app: Hono


}