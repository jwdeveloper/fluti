import type {RequestEvent, ResolveOptions} from "@sveltejs/kit";
import type {ApiMiddlewareConfigFn} from "$lib/fluti/server2/middlewares/api/ApiMiddlewareTypes";
import type {Hono} from "hono";
import type {SessionMiddlewareConfigFn} from "$lib/fluti/server2/middlewares/session/SessionMiddlewareTypes";
import type {SideMapMiddlewareFn} from "$lib/fluti/server2/middlewares/sidemap/SideMapMiddleware";

export interface FlutiServer2Builder {

    app: Hono

    configure(onConfig: (config: FlutiServer2Config) => void): FlutiServer2Builder

    use(middleware: FlutiServer2Middleware): FlutiServer2Builder

    useApi(onConfig: ApiMiddlewareConfigFn): FlutiServer2Builder

    useSession(onConfig?: SessionMiddlewareConfigFn): FlutiServer2Builder

    useSideMap(onConfig?: SideMapMiddlewareFn): Promise<FlutiServer2Builder>

    useAuthorization(): FlutiServer2Builder

    create(): Promise<FlutiServer2>
}

export interface FlutiServer2 {
    handel(event: RequestEvent, resolve: (event: RequestEvent, opts?: ResolveOptions) => any): any
}

export type FlutiServer2Middleware = (config: FlutiServer2Config) => Promise<void> | void;

export interface FlutiServer2Config {

    /**
     * instance of Hono app
     */
    app: Hono

    /**
     * Default theme "light"
     * Then theme is found in headers "theme" then use it from headers
     * It replaces %fluti.theme% in app.html with value
     */
    defaultTheme: string

    /**
     * Default theme "en"
     * Then theme is found in headers "lang" then use it from headers
     * It replaces %fluti.lang% in app.html with value
     */
    defaultLang: string

}