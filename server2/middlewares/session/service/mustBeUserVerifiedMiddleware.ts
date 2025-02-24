import type {Context} from "hono";


export async function mustBeUserVerifiedApiMiddleware(c: Context, next: any) {
    let user = c.get("user");
    if (!user)
        return c.json({error: "mustBeUserVerifiedApiMiddleware: user not auth"}, 400)

    if (!user.verified)
        return c.json({error: "mustBeUserVerifiedApiMiddleware: user not verified"}, 400)
    return await next();
}
