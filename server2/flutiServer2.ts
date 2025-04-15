import type {
    FlutiServer2,
    FlutiServer2Builder,
    FlutiServer2Config,
    FlutiServer2Middleware
} from "$lib/fluti/server2/flutiServer2Types";
import type {RequestEvent, ResolveOptions} from "@sveltejs/kit";
import {type Context, Hono, type Next} from "hono";
import {useApiMiddleware} from "$lib/fluti/server2/middlewares/api/ApiMiddleware";
import type {ApiMiddlewareConfigFn} from "$lib/fluti/server2/middlewares/api/ApiMiddlewareTypes";
import type {SessionMiddlewareConfigFn} from "$lib/fluti/server2/middlewares/session/SessionMiddlewareTypes";
import {useSessionMiddleware} from "$lib/fluti/server2/middlewares/session/SessionMiddleware";
import {type SideMapMiddlewareFn, useSideMapMiddleware} from "$lib/fluti/server2/middlewares/sidemap/SideMapMiddleware";


export class FlutiServer2BuilderImpl implements FlutiServer2Builder {

    app: Hono
    config: FlutiServer2Config
    middlewareBuilders: FlutiServer2Middleware[] = []

    constructor() {
        this.app = new Hono();
        this.config = {
            app: this.app,
            defaultTheme: 'light',
            defaultLang: 'en'
        }
    }


    async defaultMiddleware(context: Context, next: Next) {
        const honoResult: any = await next();
        const shouldRenderSvelte = context?.res.status === 404 && context?.res.url === '';
        if (!honoResult || shouldRenderSvelte) {
            context.res = await context.env.renderSvelte();
            return context.res;
        }
        return honoResult;
    }

    configure(onConfig: (config: FlutiServer2Config) => void): FlutiServer2Builder {
        onConfig(this.config)
        return this;
    }

    async useSideMap(onConfig: SideMapMiddlewareFn): Promise<FlutiServer2Builder> {
        let middleware = await useSideMapMiddleware(onConfig);
        this.middlewareBuilders.push(middleware)
        return this;
    }


    useApi(onConfig: ApiMiddlewareConfigFn): FlutiServer2Builder {
        this.middlewareBuilders.push(useApiMiddleware(onConfig))
        return this;
    }

    useSession(onConfig: SessionMiddlewareConfigFn): FlutiServer2Builder {
        this.middlewareBuilders.push(useSessionMiddleware(onConfig))
        return this;
    }

    useAuthorization(): FlutiServer2Builder {
        throw new Error("Method not implemented.");
    }


    // @ts-ignore
    use(config): FlutiServer2Builder {
        this.middlewareBuilders.push(async (inpt) => {
            config(inpt)
        })
    }

    async create(): Promise<FlutiServer2> {
        this.app.use(this.defaultMiddleware);
        for (let middlewareBuilder of this.middlewareBuilders) {
            await middlewareBuilder(this.config)
        }
        return new FlutiServer2Impl(this.config);
    }

}

export class FlutiServer2Impl implements FlutiServer2 {

    app: Hono
    config: FlutiServer2Config

    constructor(config: FlutiServer2Config) {
        this.app = config.app;
        this.config = config;
    }


    handel(event: RequestEvent, resolve: (event: RequestEvent, opts?: ResolveOptions) => any) {

        const theme = event.cookies.get("theme") ?? this.config.defaultTheme;
        const lang = event.cookies.get("lang") ?? this.config.defaultLang;

        let transformChunk = async (e: any) => {
            e.done = true;
            return e.html
                .replace("%fluti.theme%", theme.substring(0, Math.min(10, theme.length)))
                .replace("%fluti.lang%", lang.substring(0, Math.min(10, lang.length)));
        }
        let resolveSvelte = () => {
            return resolve(event, {
                transformPageChunk: transformChunk
            });
        }

        return this.app.request(event.request, undefined,
            {
                ip: event?.getClientAddress?.(),
                // svelteEvent: event,
                renderSvelte: resolveSvelte
            });
    }

}


export function createFlutiServer(): FlutiServer2Builder {
    return new FlutiServer2BuilderImpl();
}