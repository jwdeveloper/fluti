import type {RequestEvent} from "@sveltejs/kit";

type ProxyMiddlewareOptions = {
    targetDomain: string; // The domain to which the request should be proxied
    pathPrefix?: string; // Prefix to match routes for proxying
    ignoredRoutes?: string[]; // Routes to ignore from proxying
    restMethods?: string[]; // HTTP methods to allow for proxying
    onProxySuccess?: (event: RequestEvent, response: Response) => void; // Callback on successful proxying
    onProxyError?: (event: RequestEvent, error: any) => void; // Callback on proxy error
};

export let useProxyMiddleware = (options: ProxyMiddlewareOptions) => {

    const {
        targetDomain,
        pathPrefix = '',
        ignoredRoutes = [],
        restMethods = ["GET", "POST", "PUT", "DELETE", "PATCH"],
        onProxySuccess,
        onProxyError,
    } = options;

    return async (event: RequestEvent, next: Function) => {
        const {url, request, route} = event;

        if (ignoredRoutes.some((ignoredRoute) => url.pathname.startsWith(ignoredRoute))) {
            return;
        }

        if (!url.pathname.startsWith(pathPrefix)) {
            return;
        }

        if (!restMethods.includes(request.method)) {
            return
        }

        const proxyUrl = new URL(url.pathname.replace(pathPrefix, ""), targetDomain);
        proxyUrl.search = url.search;

        try {
            const proxyResponse = await fetch(proxyUrl.toString(), {
                method: request.method,
                headers: request.headers,
                body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
                redirect: "manual",
                //@ts-ignore
                duplex: "half",

            });

            if (onProxySuccess) {
                onProxySuccess(event, proxyResponse);
            }

            const responseBody = await proxyResponse.text();
            // return new Response(responseBody, {
            //     status: proxyResponse.status,
            //     headers: proxyResponse.headers,
            // });
        } catch (error) {
            // console.log("proxy error", error)
            if (onProxyError) {
                onProxyError(event, error);
            }
        }
    }
}