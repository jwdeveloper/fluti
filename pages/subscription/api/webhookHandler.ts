import type {Context} from "hono";

export async function handleWebhook(c: Context) {
    return c.json(
        {
            error:
                "Legacy payment webhook is disabled. Use Better Auth Stripe plugin webhook handling in better-auth/config.ts.",
        },
        410,
    );
}
