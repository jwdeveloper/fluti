import type {RequestEvent} from "@sveltejs/kit";
import type {FlutiUserSession} from "$lib/fluti/server/serverTypes";
import {redirectTo} from "$lib/fluti/utils/httpUtils";

export interface SessionMiddlewareOptions {
    //default 'name'
    cookieName: string
    logoutRoute: string,
    loginRoute: string,
    userMapping?: (input: any) => FlutiUserSession
}

let optionsInstance: SessionMiddlewareOptions = {
    cookieName: "user",
    logoutRoute: '/logout',
    loginRoute: '/login',
    userMapping: (e) => e,
}

const middleware = (event: RequestEvent, next: any) => {

    if (event.url.pathname === '/logout') {
        event.cookies.delete(optionsInstance.cookieName, {path: '/'})
        return redirectTo(optionsInstance.loginRoute);
    }


    const userString = event.cookies.get(optionsInstance.cookieName)
    if (!userString)
        return;

    //@ts-ignore
    event.locals.user = JSON.parse(userString);
    if (optionsInstance.userMapping) {
        //@ts-ignore
        event.locals.user = optionsInstance.userMapping(event.locals.user)
    }
}


export const useSessionMiddleware =
    (options: SessionMiddlewareOptions) => {
        if (options)
            optionsInstance = options;

        return middleware;
    }
