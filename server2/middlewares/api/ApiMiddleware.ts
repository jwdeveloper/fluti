import type {ApiMiddlewareConfig, ApiMiddlewareConfigFn} from "$lib/fluti/server2/middlewares/api/ApiMiddlewareTypes";
import type {FlutiServer2Config, FlutiServer2Middleware} from "$lib/fluti/server2/flutiServer2Types";
import {Hono} from "hono";


export function useApiMiddleware(onConfig: ApiMiddlewareConfigFn): FlutiServer2Middleware {
    return (flutiConfig: FlutiServer2Config) => {

        const apiVersions = new Map<string, Hono>();
        const config: ApiMiddlewareConfig = {
            useSwagger: false,
            currentApiVersion: 'v1',
            api(version?: string): Hono {
                const finalVersion = version ?? '';
                if (!apiVersions.has(finalVersion)) {
                    apiVersions.set(finalVersion, new Hono())
                }
                //@ts-ignore
                return apiVersions.get(finalVersion)
            }
        }
        onConfig(config);
        apiVersions.forEach((value, key) => {
            flutiConfig.app.route(`/api/${key}`, value)
        })

        if (config.currentApiVersion === '')
            return
        if (!apiVersions.has(config.currentApiVersion))
            return;

        //@ts-ignore
        const controller: Hono = apiVersions.get(config.currentApiVersion);
        flutiConfig.app.route("/api", controller);
    }
}