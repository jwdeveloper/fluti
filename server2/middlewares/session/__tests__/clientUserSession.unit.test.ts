// @vitest-environment jsdom
import {describe, expect, test, vi} from "vitest";
import {UserSession} from "$lib/fluti/server2/middlewares/session/clientUserSession.svelte.ts";

function clearCookie(name: string) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

function toBase64Url(value: string) {
    return btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

describe("UserSession.loadSession", () => {
    test("does not set isLogin when token payload cannot be decoded", () => {
        const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {
        });
        clearCookie("session_token");
        document.cookie = "session_token=invalid.token.value";
        const session = new UserSession();

        const result = session.loadSession();

        expect(result).toBe(false);
        expect(session.isLogin).toBe(false);
        expect(session.token).toBe("");
        consoleErrorSpy.mockRestore();
    });

    test("sets isLogin for a decodable token payload", () => {
        clearCookie("session_token");
        const payload = toBase64Url(JSON.stringify({id: "u1", email: "john@example.com"}));
        document.cookie = `session_token=header.${payload}.sig`;
        const session = new UserSession();

        const result = session.loadSession();

        expect(result).toBe(true);
        expect(session.isLogin).toBe(true);
        expect(session.user.id).toBe("u1");
    });
});
