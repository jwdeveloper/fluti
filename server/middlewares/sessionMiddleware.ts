import type {RequestEvent} from "@sveltejs/kit";
import type {FlutiUser} from "$lib/fluti/server/serverTypes";
import {redirectTo} from "$lib/fluti/utils/httpUtils";

export interface SessionMiddlewareOptions {
    //default 'name'
    cookieName?: string
    logoutRoute?: string,
    loginRoute?: string,
    userMapping?: (input: any, event: RequestEvent) => Promise<FlutiUser>
    onVerifyToken?: (token: string, event: RequestEvent) => Promise<boolean>
}

let optionsInstance: SessionMiddlewareOptions = {
    cookieName: "user",
    logoutRoute: '/logout',
    loginRoute: '/login',
    onVerifyToken: async (a, b) => true,
    userMapping: (e) => e,
}


const middleware = async (event: RequestEvent, next: any) => {

    if (event.url.pathname === (optionsInstance.logoutRoute ?? "/logout")) {
        event.cookies.delete(optionsInstance.cookieName ?? "user", {path: '/'})
        return redirectTo(optionsInstance.loginRoute ?? "/login");
    }

    const userString = event.cookies.get(optionsInstance.cookieName ?? "user")
    if (!userString)
        return;

    //@ts-ignore
    event.locals.user = JSON.parse(userString);
    if (optionsInstance.userMapping) {
        //@ts-ignore
        event.locals.user = await optionsInstance.userMapping(event.locals.user, event)
    }
    if (optionsInstance.onVerifyToken) {
        const token = event.cookies.get("token")
        const verified = await optionsInstance.onVerifyToken(userString, event);
        //@ts-ignore
        event.locals.user.verfied = verified;
    }
}


export const useSessionMiddleware =
    (options: SessionMiddlewareOptions) => {
        if (options)
            optionsInstance = options;

        return middleware;
    }
