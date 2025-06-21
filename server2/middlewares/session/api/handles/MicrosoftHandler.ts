import type {OAuthEvent} from "$lib/fluti/server/middlewares/oauth/oAuthTypes";

export async function handleMicrosoftOAuth(event: OAuthEvent) {


    // 1. Exchange code for token
    const params = new URLSearchParams({
        client_id: '',
        scope: 'openid profile email User.Read',
        code: event.code,
        client_secret: "",
        redirect_uri: event.redirect,
        grant_type: 'authorization_code',
        code_verifier: event.verifier
    });

    const res = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: params
    });

    const token = await res.json();
    const profileRes = await fetch('https://graph.microsoft.com/v1.0/me', {
        headers: {
            Authorization: `Bearer ${token.access_token}`
        }
    });


    const profile = await profileRes.json();
    return {
        id: profile.id,
        name: profile.displayName,
        email: profile.mail || profile.userPrincipalName
    };
}
