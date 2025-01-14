import type {FlutiServerMiddleware} from "$lib/fluti/server/serverTypes";
import type {RequestEvent} from "@sveltejs/kit";
import {CacheService} from "$lib/fluti/services/CacheService";


interface I18MiddlewareOptions {
    path?: string
}

let cache = new CacheService();

export let useI18Middleware: (options: I18MiddlewareOptions) => FlutiServerMiddleware =
    (options) => {


        return async (event: RequestEvent) => {
            let path = options.path || 'lang';



        }
    }