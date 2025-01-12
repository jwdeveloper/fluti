import type {PathOptions, PathOptionsBuilder, RequestHandler} from "./routeTypes";
import type {FlutiUserSession, OneOrMore} from "$lib/fluti/server/serverTypes";
import {json, redirect, text} from "@sveltejs/kit";

export class PathOptionsBuilderImpl implements PathOptionsBuilder {


    private anonymous = false;
    private methods: Set<string> = new Set();
    private permissions: Set<string> = new Set();
    private verified = false;
    private admin = false;
    private userValidator?: (user: any) => boolean;
    private headers: Map<string, (e: string) => boolean> = new Map();
    private params: Map<string, (e: string) => boolean> = new Map();
    private cookies: Map<string, (e: string) => boolean> = new Map();

    private handler?: RequestHandler

    //@ts-ignore
    private elseMethod: (response: Response | undefined) => Response | any;

    withRestMethods(restMethod: OneOrMore<string>): PathOptionsBuilder {
        if (Array.isArray(restMethod)) {
            restMethod.forEach(permission => this.methods.add(permission));
        } else {
            this.methods.add(restMethod);
        }
        return this;
    }

    withHandler(handler: RequestHandler): PathOptionsBuilder {
        this.handler = handler
        return this;
    }

    isAnonymous(): PathOptionsBuilder {
        this.anonymous = true;
        return this;
    }


    isPermission(value: OneOrMore<string>): PathOptionsBuilder {
        if (Array.isArray(value)) {
            value.forEach(permission => this.permissions.add(permission));
        } else {
            this.permissions.add(value);
        }
        return this;
    }


    isVerified(): PathOptionsBuilder {
        this.verified = true;
        return this;
    }

    isAdmin(): PathOptionsBuilder {
        this.admin = true;
        return this;
    }

    isUser(method: (user: FlutiUserSession) => boolean): PathOptionsBuilder {

        if (method === undefined) {
            this.userValidator = (e) => {
                return e !== undefined
            }
            return this;
        }

        this.userValidator = method;
        return this;
    }

    hasHeader(name: string, value: (e: string) => boolean): PathOptionsBuilder {
        this.headers.set(name, value);
        return this;
    }

    hasParameter(name: string, value: (e: string) => boolean): PathOptionsBuilder {
        this.params.set(name, value);
        return this;
    }

    hasCookie(name: string, value: (e: string) => boolean): PathOptionsBuilder {
        this.cookies.set(name, value);
        return this;
    }

    orElseRedirect(route: string): PathOptionsBuilder {
        this.elseMethod = () => {
            throw redirect(307, route)
        };
        return this;
    }

    orElseMessage(message: string): PathOptionsBuilder {
        this.elseMethod = () => text(message)
        return this;

    }

    orElseJson(object: any): PathOptionsBuilder {
        this.elseMethod = () => json(object);
        return this;
    }

    orElse(method: (response: Response | undefined) => any): PathOptionsBuilder {
        this.elseMethod = method;
        return this;
    }

    build(): PathOptions {
        return {
            anonymous: this.anonymous,
            methods: Array.from(this.methods),
            permissions: Array.from(this.permissions),
            userValidator: this.userValidator,
            verified: this.verified,
            admin: this.admin,
            headers: Array.from(this.headers.entries()),
            params: Array.from(this.params.entries()),
            cookies: Array.from(this.cookies.entries()),
            elseMethod: this.elseMethod,
            handler: this.handler,
        };
    }
}
