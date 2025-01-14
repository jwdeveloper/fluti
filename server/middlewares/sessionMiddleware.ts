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

const polishIPRanges = [
    {start: "77.0.0.0", end: "77.255.255.255"},
    {start: "78.8.0.0", end: "78.9.255.255"},
    {start: "79.184.0.0", end: "79.191.255.255"},
    {start: "80.48.0.0", end: "80.55.255.255"},
    {start: "83.0.0.0", end: "83.31.255.255"},
    {start: "85.128.0.0", end: "85.255.255.255"},
    {start: "91.192.0.0", end: "91.200.255.255"},
    {start: "93.184.0.0", end: "93.184.127.255"},
    {start: "194.0.0.0", end: "194.255.255.255"},
];

function ipToInt(ip) {
    return ip.split('.').reduce((acc, part) => (acc << 8) + parseInt(part, 10), 0);
}
function isPolishIP(ip) {
    const ipInt = ipToInt(ip);
    for (const range of polishIPRanges) {
        const startInt = ipToInt(range.start);
        const endInt = ipToInt(range.end);
        if (ipInt >= startInt && ipInt <= endInt) {
            return true;
        }
    }
    return false;
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
