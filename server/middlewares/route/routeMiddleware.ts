import {redirect, type RequestEvent, text} from "@sveltejs/kit";
import type {MiddlewareOptions, PathOptions, RouteOptionsBuilder} from "$lib/fluti/server/middlewares/route/routeTypes";
import {RouteOptionsBuilderImpl} from "$lib/fluti/server/middlewares/route/routeOptionsBuilderImpl";
import {redirectTo} from "$lib/fluti/utils/httpUtils";
import type {FlutiUser} from "$lib/fluti/server/serverTypes";

export type RouteMiddlewareOptions = (options: RouteOptionsBuilder) => void

let middlewareOptions: MiddlewareOptions;

function returnError(message: string) {
    console.log(message)
    return new Response(message, {status: 403});
}


function validatePathOptions(options: PathOptions, request: RequestEvent) {
    //@ts-ignore
    const user = request.locals?.user;


    if (options.methods && options.methods.length > 0) {
        let foundMethod = options.methods.some((p: string) => p === request.request.method)
        if (!foundMethod)
            return
    }

    if (options.isValidator && !options.isValidator(request))
        return returnError("Is validator failed");

    if (options.anonymous) {
        return
    }

    if (options.userValidator && !user)
        return returnError("IsUser failed, user can't be null");
    else if (options.userValidator && !options.userValidator(user, request))
        return returnError("IsUser status failed");


    if (options.verified) {
        let isVerified = user?.verified || user?.verified_email;
        if (!isVerified)
            return returnError("User is not verified");
    }

    if (options.admin && !user?.isAdmin)
        return returnError("Admin access required");

    if (options.permissions &&
        options.permissions.length > 0 &&
        !options.permissions.some((p: string) => user?.permissions?.includes(p)))
        return returnError("Permission denied");

    if (options.headers) {
        let headers = request.request.headers;
        for (const [header, validator] of options.headers || []) {
            let value = headers.get(header);
            if (value === null)
                return returnError(`Header is missing: ${header}`);

            let headerValidationResult = validator(value);
            if (!headerValidationResult)
                return returnError(`Invalid header: ${header}`);
        }
    }

    if (options.params) {
        let params = request.params; // Assume `params` contains query or path parameters
        for (const [param, validator] of options.params || []) {
            let value = params[param];
            if (value === undefined)
                return returnError(`Param is missing: ${param}`);

            let paramValidationResult = validator(value);
            if (!paramValidationResult)
                return returnError(`Invalid parameter: ${param}`);

        }
    }

    if (options.cookies) {
        let cookies = request.cookies;
        for (const [cookie, validator] of options.cookies || []) {
            let value = cookies.get(cookie);
            if (value === undefined)
                return returnError(`Cookie is missing: ${cookie}`);

            let paramValidationResult = validator(value);
            if (!paramValidationResult)
                return returnError(`Invalid parameter: ${cookie}`);
        }
    }
}


let middleware = async (request: RequestEvent, next: any) => {

    const path = request.url.pathname;
    const mappedRoute = middlewareOptions.mappedRoutes.find(([source]) => source === path);
    if (mappedRoute) {
        const destination = mappedRoute[1];
        throw redirect(307, destination);
    }

    if (!middlewareOptions.pathsOptions)
        return
    const pathOptions = middlewareOptions.pathsOptions.find((entry: any) => entry.path === path);
    let options = pathOptions?.options;
    if (!options)
        options = middlewareOptions.globalPathOptions

    let validationFailedResponse = validatePathOptions(options, request);

    if (!validationFailedResponse) {

        if (options.handler) {
            //@ts-ignore
            let user: FlutiUser = request.locals.user;
            let event = {user, ...request}
            return await options.handler(event)
        }
        return
    }

    if (options.elseMethod)
        validationFailedResponse = await options.elseMethod(validationFailedResponse);

    return validationFailedResponse;
};


export const useRouteMiddleware = (options: RouteMiddlewareOptions) => {

    let builder = new RouteOptionsBuilderImpl();
    if (options)
        options(builder)

    middlewareOptions = builder.build();
    return middleware;
}

