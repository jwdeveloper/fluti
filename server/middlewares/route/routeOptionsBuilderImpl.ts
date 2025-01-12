import type {PathOptionsBuilder, RouteOptionsBuilder} from "./routeTypes";
import type {OneOrMore} from "$lib/fluti/server/serverTypes";
import {PathOptionsBuilderImpl} from "$lib/fluti/server/middlewares/route/pathOptionsBuilderImpl";

export class RouteOptionsBuilderImpl implements RouteOptionsBuilder {
    private pathsOptions: Map<string, PathOptionsBuilderImpl> = new Map();
    private globalPathOptions: PathOptionsBuilderImpl = new PathOptionsBuilderImpl();
    private mappedRoutes: Map<string, string> = new Map();

    route(routes: OneOrMore<string>): PathOptionsBuilder {
        const pathsArray = Array.isArray(routes) ? routes : [routes];
        const builder = new PathOptionsBuilderImpl();

        pathsArray.forEach(route => {
            this.pathsOptions.set(route, builder);
        });

        return builder;
    }

    global(): PathOptionsBuilder {
        return this.globalPathOptions;
    }

    map(routes: OneOrMore<string>, destination: string): RouteOptionsBuilder {
        const routesArray = Array.isArray(routes) ? routes : [routes];

        routesArray.forEach(route => {
            this.mappedRoutes.set(route, destination);
        });

        return this;
    }

    build() {
        const globalOptions = this.globalPathOptions.build();
        const pathOptions = Array.from(this.pathsOptions.entries()).map(([path, builder]) => ({
            path,
            options: {...globalOptions, ...builder.build()},
        }))
        return {
            pathsOptions: pathOptions,
            globalPathOptions: globalOptions,
            mappedRoutes: Array.from(this.mappedRoutes.entries()),
        };
    }
}