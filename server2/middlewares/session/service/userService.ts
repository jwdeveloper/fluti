import type {LoginResponse} from "$lib/fluti/pages/login/loginPageTypes";
//@ts-ignore
import type {SessionMiddlewareConfig} from "$lib/fluti/server2/middlewares/session/SessionMiddlewareTypes";
import type {Context} from "hono";
import {sign} from "hono/jwt";
import {setCookie} from "hono/cookie";


export async function returnUserAuthTokens(
    context: Context,
    config: SessionMiddlewareConfig,
    dbToken: string,
    userRecord: any): Promise<LoginResponse> {

    console.log('user record', userRecord)
    const token = await sign(
        {
            id: userRecord.id,
            email: userRecord.email,
            login: userRecord.email,
            avatar: userRecord?.profile?.picture,
            name: userRecord.name ?? userRecord.email,
            verified: userRecord.verified ?? false,
            admin: userRecord?.admin ?? false,
            guest: false
        }, config.token.secret);

    let data: LoginResponse = {
        message: "successful login",
        error: false,
        token: token,
        dbToken: dbToken
    }
    setCookie(context, config.token.cookieName, token, {
        secure: true,
        sameSite: 'Strict',
        maxAge: config.token.tokenExpirationTime
    });
    setCookie(context, 'db_token', dbToken, {
        secure: true,
        sameSite: 'Strict',
        maxAge: config.token.tokenExpirationTime
    });
    return data;
}