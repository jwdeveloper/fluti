import type {FlutiServer2Middleware} from "$lib/fluti/server2/flutiServer2Types";
import type {Context} from "hono";

export type SideMapMiddlewareFn = (event: SideMapMiddleware) => void;

export interface SideMapPath {
    route: string
    updatedAt?: string //2025-02-27T10:00:00Z
    changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"
    priority?: number //range 0.0-1.0
}

export interface SideMapMiddleware {
    domain: string

    addPath(path: SideMapPath | string): SideMapMiddleware
}

class SideMapMiddlewareImpl implements SideMapMiddleware {

    domain: string = 'http://localhost:5173/'
    paths: SideMapPath[] = []
    private routes: Set<string> = new Set<string>()

    private normalizeRoute(route: string): string {
        if (!route) {
            return "/";
        }
        let normalized = route.trim();
        if (!normalized) {
            return "/";
        }
        if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
            try {
                normalized = new URL(normalized).pathname;
            } catch (error) {
                normalized = "/";
            }
        }
        if (!normalized.startsWith("/")) {
            normalized = `/${normalized}`;
        }
        return normalized;
    }

    addPath(path: SideMapPath | string): SideMapMiddleware {

        let obj: SideMapPath;
        if (typeof path === 'string')
            obj = {
                route: this.normalizeRoute(path)
            }
        else
            obj = {
                ...path,
                route: this.normalizeRoute(path.route)
            };

        if (this.routes.has(obj.route)) {
            return this;
        }
        this.routes.add(obj.route);
        this.paths.push(obj);
        return this;
    }

    build(): string {

        let singlePathToString = (obj: SideMapPath) => {
            let updatedAt = obj?.updatedAt ?? new Date().toISOString().split('.')[0] + 'Z';
            let priority = obj?.priority ?? 0.5;
            let frequency = obj?.changeFrequency ?? 'weekly';
            const location = new URL(this.normalizeRoute(obj.route), this.domain).toString();

            return `
        <url>
            <loc>${location}</loc>
            <lastmod>${updatedAt}</lastmod>
            <changefreq>${frequency}</changefreq>
            <priority>${priority}</priority>
        </url>
    `
        }
        let pathsStrings = this.paths.map(singlePathToString).join("\n ");

        return `
        <?xml version="1.0" encoding="UTF-8"?>
			<urlset
				xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
				xmlns:xhtml="http://www.w3.org/1999/xhtml"
				xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
				xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
				xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
				xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
			>
				${pathsStrings}
			</urlset>
        `.trim();
    }
}


export async function useSideMapMiddleware(fn: SideMapMiddlewareFn): Promise<FlutiServer2Middleware> {

    let sideMap = new SideMapMiddlewareImpl();
    await fn(sideMap);
    let map = sideMap.build();

    return async (server) => {
        const handleRequest = (_: Context) => {
            return new Response(map, {
                status: 200,
                headers: {
                    'Content-Type': 'application/xml; charset=utf-8'
                }
            });
        };
        server.app.get("/sidemap.xml", handleRequest);
        server.app.get("/sitemap.xml", handleRequest);
    }
}
