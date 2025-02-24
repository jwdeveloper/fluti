import {Hono} from "hono";

export interface ApiMiddlewareConfig {

    useSwagger: boolean

    /**
     * Specify current API version
     * if you set for example v2
     *
     * all endpoints from version v2 will also work on base api path
     * so /api/v2/hello also works as path /api/hello
     *
     */
    currentApiVersion: string

    /**
     * Returns Hono handler for api, default path is {SERVER_DOMAIN}/api/...
     *
     * @param version by using version parameter you return Hono controller for wanted version
     * for example version = v2 will return Hono with path {SERVER_DOMAIN}/api/v2/...
     */
    api(version?: string): Hono
}

export type ApiMiddlewareConfigFn = (config: ApiMiddlewareConfig) => void