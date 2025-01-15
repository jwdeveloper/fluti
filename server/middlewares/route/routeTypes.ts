import type {FlutiUser, OneOrMore} from "$lib/fluti/server/serverTypes";
import type {RequestEvent} from "@sveltejs/kit";

export type MiddlewareOptions = {
    pathsOptions: {
        path: string;
        options: PathOptions;
    }[];
    globalPathOptions: PathOptions;
    mappedRoutes: [string, string][];
};

export type PathOptions = {
    isValidator?: (event: RequestEvent) => boolean;
    anonymous?: boolean;
    permissions?: string[];
    methods?: string[];
    userValidator?: UserValidator,
    verified?: boolean;
    admin?: boolean;
    headers?: [string, (e: string) => boolean][];
    params?: [string, (e: string) => boolean][];
    cookies?: [string, (e: string) => boolean][];
    elseMethod?: (input: Response | undefined) => Promise<Response>
    handler?: FlutiRequestHandler
};

export type UserValidator = (user: FlutiUser, event: RequestEvent) => boolean | {
    status: boolean,
    message: string
}

export type FlutiRequestHandler = (event: RequestHandlerEvent) => any | void

export interface RequestHandlerEvent extends RequestEvent {
    user: FlutiUser | undefined
}

export interface PathOptionsBuilder {

    isAnonymous(): PathOptionsBuilder

    isPermission(value: OneOrMore<string>): PathOptionsBuilder

    isVerified(): PathOptionsBuilder

    isAdmin(): PathOptionsBuilder

    //* @param event - function that validates request event
    is(event: (event: RequestEvent) => boolean): PathOptionsBuilder

    /**
     * Method that validates user session content
     *
     * @param method if parameter not provided then checks if user session exists
     *
     */
    isUser(method?: UserValidator): PathOptionsBuilder

    withMethod(value: OneOrMore<string>): PathOptionsBuilder

    withHandler(handler: FlutiRequestHandler): PathOptionsBuilder

    hasHeader(name: string, value?: (e: string) => boolean): PathOptionsBuilder

    hasParameter(name: string, value?: (e: string) => boolean): PathOptionsBuilder

    hasCookie(name: string, value?: (e: string) => boolean): PathOptionsBuilder

    orElseRedirect(route: string): PathOptionsBuilder;

    orElseMessage(message: string): PathOptionsBuilder;

    orElseJson(object: any): PathOptionsBuilder;

    orElse(method: (errorResponse: Response | undefined) => any): PathOptionsBuilder;

    build(): PathOptions
}


export interface RouteOptionsBuilder {

    //applies rules given paths
    route(routes: OneOrMore<string>): PathOptionsBuilder

    //applies rules to the all possible paths
    global(): PathOptionsBuilder

    //maps provided paths into destination path
    map(routes: OneOrMore<string>, destination: string): RouteOptionsBuilder

    build(): MiddlewareOptions
}