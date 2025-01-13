export class UserSession {
    isLogin = $state(false)
    session: any = $state({})
    user: any = $state({})

    setSession(token: string, data: any) {
        this.user = data;
        this.session = token;
        this.isLogin = true;

        document.cookie = `user=${encodeURIComponent(JSON.stringify(this.user))}; path=/;`;
        document.cookie = `session=${encodeURIComponent(JSON.stringify(this.session))}; path=/;`;
    }

    loadSession() {
        const cookies = document.cookie.split('; ')
            .reduce((acc, cookie) => {
            const [key, value] = cookie.split('=');
            acc[key] = decodeURIComponent(value);
            return acc;
        }, {} as Record<string, string>);
        if (cookies.user && cookies.session) {
            try {
                this.user = JSON.parse(cookies.user);
                this.session = JSON.parse(cookies.session);
                this.isLogin = true;
            } catch (e) {
                console.error("Failed to parse session cookies", e);
                this.clearSession();
            }
        }
    }


    clearCookie(cookieName: any) {
        // Set the cookie with an expired date to clear it
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }

    clearSession() {
        this.user = undefined;
        this.session = undefined;
        this.isLogin = false;
        this.redirectTo('/logout');
    }

    redirectToHome() {
        if (window.location.pathname === '/') {
            return
        }
        window.location.href = '/';
    }

    redirectTo(url: string) {
        if (window.location.pathname === url) {
            return
        }
        window.location.href = url;
    }


    redirectToLogin() {
        if (window.location.pathname === '/login') {
            return
        }
        window.location.href = '/login';
    }
}


let session = new UserSession();

export let useUserSession = () => {
    return session;
}
