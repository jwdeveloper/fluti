import type {FlutiUser} from "$lib/fluti/server/serverTypes";

function parseJwt(token: string) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
                .join('')
        );

        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Invalid token", e);
        return null;
    }
}

function loadCookies() {
    const cookies = document.cookie.split('; ')
        .reduce((acc, cookie) => {
            const [key, value] = cookie.split('=');
            acc[key] = decodeURIComponent(value);
            return acc;
        }, {} as Record<string, string>);
    return cookies;
}


export class UserSession {
    //@ts-ignore
    user: FlutiUser = $state({})
    token: string = $state('')
    isLogin: boolean = $state(false)

    loadSession(tokenCookieName: string = 'session_token') {
        const cookies = loadCookies();
        if (!cookies[tokenCookieName]) {
            this.isLogin = false;
            this.user = {} as FlutiUser;
            this.token = ''
            return false;
        }
        this.token = cookies[tokenCookieName];
        this.user = parseJwt(this.token);
        this.isLogin = true;
        return true;
    }

    redirectTo(url: string) {
        if (window.location.pathname === url) {
            return
        }
        window.location.href = url;
    }

    async logout(callbackUrl: string = '/') {
        await fetch('/api/auth/logout', {method: 'post'})
        this.redirectTo(callbackUrl)
    }
}

const userSession = new UserSession();
export default userSession;
