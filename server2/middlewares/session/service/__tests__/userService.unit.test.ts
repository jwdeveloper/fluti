import {describe, expect, test, vi} from "vitest";

const {signMock, setCookieMock} = vi.hoisted(() => {
    return {
        signMock: vi.fn(async () => "signed-token"),
        setCookieMock: vi.fn()
    };
});

vi.mock("hono/jwt", () => ({
    sign: signMock
}));

vi.mock("hono/cookie", () => ({
    setCookie: setCookieMock
}));

describe("returnUserAuthTokens", () => {
    test("sets exp claim and cookie maxAge using tokenExpirationTime in seconds", async () => {
        const {returnUserAuthTokens} = await import("$lib/fluti/server2/middlewares/session/service/userService");

        const context = {} as any;
        const config = {
            token: {
                cookieName: "session_token",
                tokenExpirationTime: 3600,
                secret: "secret"
            }
        } as any;

        const started = Math.floor(Date.now() / 1000);
        await returnUserAuthTokens(context, config, "db-token", {
            id: "u1",
            email: "john@example.com",
            verified: true
        });

        const payload = signMock.mock.calls[0][0];
        expect(payload.exp).toBeGreaterThanOrEqual(started + 3599);
        expect(payload.exp).toBeLessThanOrEqual(started + 3601);

        expect(setCookieMock).toHaveBeenCalledWith(context, "session_token", "signed-token", expect.objectContaining({
            maxAge: 3600
        }));
        expect(setCookieMock).toHaveBeenCalledWith(context, "db_token", "db-token", expect.objectContaining({
            maxAge: 3600
        }));
    });
});
