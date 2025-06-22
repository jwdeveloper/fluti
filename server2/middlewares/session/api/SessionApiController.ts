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

    const pb = pocketbaseClient;

    controller.post(`/login`, async (c) => {
        const {email, password} = await c.req.json();
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


    return controller;
}

export function createLoginWithHeadersMiddleware(config: SessionMiddlewareConfig) {

    return async (c: Context, next: any) => {

        let login = c.req.header("login")
        if (!login) {
            return await next();
        }
        let password = c.req.header("password");

        if (!login || !password) {
            return c.json({error: "login and password are required"}, 404)
        }
        console.log(`trying to login by header with login ${login} and password ${password}`)

        try {
            const authData = await pocketbaseClient.collection('users').authWithPassword(login, password);
            const record = authData.record;
            if (record.verified === false)
                throw new Error("user is not verified")

            await returnUserAuthTokens(c, config, authData.token, record);
        } catch (error) {
            console.log(error)
            return c.json({
                token: '',
                dbToken: '',
                message: "Invalid email or password or user is not verified",
                error: true
            }, 401);
        }
        return await next();
    }
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
