import {json, redirect, type RequestEvent, text} from "@sveltejs/kit";

import type {
    FlutiServer,
    FlutiServerBuilder,
    FlutiServerMiddleware,
    FlutiServerOptions
} from "$lib/fluti/server/serverTypes";
import {type SessionMiddlewareOptions, useSessionMiddleware} from "$lib/fluti/server/middlewares/sessionMiddleware";
import {
    type RouteMiddlewareOptions,
    useRouteMiddleware
} from "$lib/fluti/server/middlewares/route/routeMiddleware";
import type {OAuthMiddlewareOptions} from "./middlewares/oauth/oAuthTypes";
import {useOAuthMiddleware} from "$lib/fluti/server/middlewares/oauth/oAuthMiddleware";
import {type ApiMiddlewareOptions, useApiMiddleware} from "$lib/fluti/server/middlewares/api/apiMiddleware";


export class FlutiServerBuilderImpl implements FlutiServerBuilder {

    options: FlutiServerOptions

    constructor() {
        this.options = {
            middlewares: [],
            errorMiddleware: () => {
            }
        }
    }

    useApi(options: ApiMiddlewareOptions): FlutiServerBuilder {
        this.use(useApiMiddleware(options))
        return this;
    }

    useRatelimit(options?: RouteMiddlewareOptions): FlutiServerBuilder {
        return this;
    }

    useCountryBlocker(options?: RouteMiddlewareOptions): FlutiServerBuilder {
        return this;
    }

    use(handler: FlutiServerMiddleware): FlutiServerBuilder {
        this.options.middlewares.push(handler)
        return this;
    }

    useOAuth(options: OAuthMiddlewareOptions): FlutiServerBuilder {
        this.use(useOAuthMiddleware(options))
        return this;
    }

    useSession(options: SessionMiddlewareOptions): FlutiServerBuilder {
        this.use(useSessionMiddleware(options))
        return this;
    }

    useRoutes(options: RouteMiddlewareOptions): FlutiServerBuilder {
        this.use(useRouteMiddleware(options))
        return this;
    }

    create(): FlutiServer {
        return new FlutiServerImpl(this.options);
    }
}


export class FlutiServerImpl implements FlutiServer {

    options: FlutiServerOptions

    constructor(options: FlutiServerOptions) {
        this.options = options;
    }

    async handle(event: RequestEvent, handle: any) {
        try {

            for (let handler of this.options.middlewares) {
                let result = await handler(event, handle);
                if (!result) {
                    continue
                }
                if (typeof result === 'string') {
                    return new Response(result, {
                        headers: [['Content-Type', 'text/plain; charset=utf-8']],
                    });
                }
                return result;
            }
        } catch (error: any) {
            console.log("Middleware error", error)
            if (this.options.errorMiddleware)
                await this.options.errorMiddleware(event, handle, error);

            throw error;
        }
        return await handle(event)
    }
}

export let createMiddleware: () => FlutiServerBuilder = () => {
    return new FlutiServerBuilderImpl();
}


export let createFlutiServer = () => {
    return new FlutiServerBuilderImpl();
}