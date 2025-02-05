import type {FlutiServerMiddleware} from "$lib/fluti/server/serverTypes";
import {Hono} from "hono";
import {CacheService} from "$lib/fluti/services/CacheService";
import type {RequestEvent} from "@sveltejs/kit";

export interface ApiMiddlewareOptionsBuilder {
    useSwagger: boolean

    api(version?: string): Hono
}

export type ApiMiddlewareOptions = (builder: ApiMiddlewareOptionsBuilder) => void;

let apiRouter = new Hono()
let apiVersions = new CacheService()

const optionsInstance: ApiMiddlewareOptionsBuilder =
    {
        useSwagger: false,
        api: (version) => {
            if (!version)
                return apiRouter;

            if (!apiVersions.has(version)) {
                const versionRouter = new Hono();
                apiVersions.set(version, versionRouter);
            }
            return apiVersions.get(version)!;
        }
    }

const middleware: FlutiServerMiddleware = async (event: RequestEvent) => {
    if (!event.url.pathname.startsWith('/api')) {
        return;
    }
    return await apiRouter.fetch(event.request);
}

export const useApiMiddleware = (options: ApiMiddlewareOptions) => {
    apiRouter = new Hono().basePath('/api');
    apiVersions = new CacheService();

    if (options)
        options(optionsInstance);

    for (let [key, value] of apiVersions.items()) {
        apiRouter.route(`/${key}`, value)
    }
    return middleware;
}
