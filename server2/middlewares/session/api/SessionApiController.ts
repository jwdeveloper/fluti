import {type Context, Hono} from 'hono';
import {sign, verify} from 'hono/jwt';
import {pocketbaseClient} from "$lib/pocketbase-client";
import type {LoginResponse} from "$lib/fluti/pages/login/loginPageTypes";
// @ts-ignore
import type {SessionMiddlewareConfig} from "$lib/fluti/server2/middlewares/session/SessionMiddlewareTypes";
import {deleteCookie, getCookie, setCookie} from 'hono/cookie';
import {CacheService} from "$lib/fluti/services/CacheService";
import {returnUserAuthTokens} from "$lib/fluti/server2/middlewares/session/service/userService";


export function createSessionApiController(config: SessionMiddlewareConfig) {
    const controller = new Hono();

    const pb = pocketbaseClient;

    controller.post(`/login`, async (c) => {
        const {email, password} = await c.req.json();
        try {
            const authData = await pb.collection('users').authWithPassword(email, password);
            const record = authData.record;
            if (record.verified === false)
                throw new Error("user is not verified")

            const result = await returnUserAuthTokens(c, config, authData.token, record);
            return c.json(result);
        } catch (error) {
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

    controller.post(`/register`, async (c) => {
        const {email, password, passwordConfirm} = await c.req.json();
        if (!email || !password || !passwordConfirm) {
            return c.json({
                error: true,
                message: 'Email, password, and password confirmation are required.'
            }, 400);
        }

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
                data: error?.response?.data ?? {},
                message: 'invalid registration data'
            }, 400);
        }
    });


    return controller;
}


export function createSessionAuthMiddleware(config: SessionMiddlewareConfig) {
    const cacheService = new CacheService();
    return async (c: Context, next: any) => {

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
