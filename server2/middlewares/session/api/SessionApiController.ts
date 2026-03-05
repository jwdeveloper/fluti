import {type Context, Hono} from 'hono';
import {verify} from 'hono/jwt';

// @ts-ignore
import type {SessionMiddlewareConfig} from "$lib/fluti/server2/middlewares/session/SessionMiddlewareTypes";
import {deleteCookie, getCookie} from 'hono/cookie';
import {CacheService} from "$lib/fluti/services/CacheService";
import {returnUserAuthTokens} from "$lib/fluti/server2/middlewares/session/service/userService";
import {pocketbaseClient} from "$lib/fluti/clients/pocketbase-client";


export function createSessionApiController(config: SessionMiddlewareConfig) {
    const controller = new Hono();


    controller.post(`/login`, async (c) => {
        const {email, password} = await c.req.json();
        const pb = await pocketbaseClient();
        try {
            // console.log('email and passowrd', email, password)
            const authData = await pb.collection('users').authWithPassword(email, password);
            const record = authData.record;
            if (record.verified === false)
                throw new Error("user is not verified")

            const result = await returnUserAuthTokens(c, config, authData.token, record);
            return c.json(result);
        } catch (error) {
            console.log(error)
            return c.json({
                token: '',
                dbToken: '',
                message: "Invalid email or password.",
                error: true
            }, 401);
        }
    });

    controller.post(`/logout`, (c) => {

        deleteCookie(c, config.token.cookieName);
        deleteCookie(c, 'db_token');
        return c.json({message: 'Logged out successfully'});
    });

    controller.get(`/logout`, (c) => {
        deleteCookie(c, config.token.cookieName);
        deleteCookie(c, 'db_token');
        return c.redirect('/');
    });


    controller.post(`/register`, async (c) => {
        const {email, password, passwordConfirm} = await c.req.json();
        if (!email || !password || !passwordConfirm) {
            return c.json({
                error: true,
                message: 'Email, password, and password confirmation are required.'
            }, 400);
        }
        const pb = await pocketbaseClient();
        try {
            await pb.collection('users').create({email, password, passwordConfirm});
            return c.json({
                error: false,
                message: 'User registered, message has been send to user email' +
                    '.'
            });
        } catch (error: any) {
            return c.json({
                error: true,
                data: JSON.stringify(error?.response?.data) ?? {},
                message: 'invalid registration data'
            }, 400);
        }
    });

    controller.post(`/login/headers`, async (c) => {
        return handleLoginByHeaders(c, config);
    });


    return controller;
}

export function createLoginWithHeadersMiddleware(config: SessionMiddlewareConfig) {

    return async (c: Context, next: any) => {
        const authHeadersPath = `${config.api.endpointPrefix}/login/headers`;
        if (c.req.path !== authHeadersPath || c.req.method !== 'POST') {
            return await next();
        }
        return handleLoginByHeaders(c, config);
    }
}

async function handleLoginByHeaders(c: Context, config: SessionMiddlewareConfig) {
    const login = c.req.header("login");
    const password = c.req.header("password");

    if (!login || !password) {
        return c.json({
            token: '',
            dbToken: '',
            message: "login and password headers are required",
            error: true
        }, 400);
    }

    try {
        const pb = await pocketbaseClient();
        const authData = await pb.collection('users').authWithPassword(login, password);
        const record = authData.record;
        if (record.verified === false)
            throw new Error("user is not verified");

        const result = await returnUserAuthTokens(c, config, authData.token, record);
        return c.json(result);
    } catch (error) {
        console.log(error);
        return c.json({
            token: '',
            dbToken: '',
            message: "Invalid email or password or user is not verified",
            error: true
        }, 401);
    }
}

export function createTokenMiddleware(config: SessionMiddlewareConfig) {
    const cacheService = new CacheService();
    return async (c: Context, next: any) => {

        // console.log('user middleware')
        let payload: any = await config.onDefaultUserData();
        c.set(config.contextPropertyName, payload);
        const token = c.req.header('Token');
        if (!token) {
            return await next();
        }
        if (config.token.useServerCache && cacheService.has(token) && token !== '') {
            payload = cacheService.get(token);
        } else {

            try {
                payload = await verify(token, config.token.secret);
                payload = await config.onTokenToUserMapping(payload);
                cacheService.set(token, payload);

            } catch (error) {
                //@ts-ignore
                if (error.name === "JwtTokenSignatureMismatched" && c.req.path !== '/login') {
                    deleteCookie(c, config.token.cookieName);
                }
            }
        }
        c.set(config.contextPropertyName, payload);
        await next()
    };
}

export function createSessionAuthMiddleware(config: SessionMiddlewareConfig) {
    const cacheService = new CacheService();
    return async (c: Context, next: any) => {

        console.log('user middleware')
        let payload: any = await config.onDefaultUserData();
        c.set(config.contextPropertyName, payload);

        const token = getCookie(c, config.token.cookieName);
        if (!token) {
            return await next();
        }

        if (config.token.useServerCache && cacheService.has(token) && token !== '') {
            payload = cacheService.get(token);
        } else {

            try {
                payload = await verify(token, config.token.secret);
                payload = await config.onTokenToUserMapping(payload);
                cacheService.set(token, payload);

            } catch (error) {
                //@ts-ignore
                if (error.name === "JwtTokenSignatureMismatched" && c.req.path !== '/login') {
                    deleteCookie(c, config.token.cookieName);
                }
            }
        }
        c.set(config.contextPropertyName, payload);
        await next()
    };
}
