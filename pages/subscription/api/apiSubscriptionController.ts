import {Hono} from "hono";
const usePaymentsMiddleware = new Hono();

usePaymentsMiddleware.all("*", (c) => {
    return c.json(
        {
            error:
                "Legacy /api/v1/payment stack is disabled. Use /api/payments and Better Auth Stripe webhook flow.",
        },
        410,
    );
});

export default usePaymentsMiddleware;



