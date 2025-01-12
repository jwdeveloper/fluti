import type {RequestEvent} from "@sveltejs/kit";
import type {FlutiUserSession} from "$lib/fluti/server/serverTypes";

export interface SessionMiddlewareOptions {
    //default 'name'
    cookieName: string
    userMapping?: (input: any) => FlutiUserSession
}

let optionsInstance: SessionMiddlewareOptions = {
    cookieName: "user",
    userMapping: (e) => e,
}

const middleware = (event: RequestEvent, next: any) => {
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
