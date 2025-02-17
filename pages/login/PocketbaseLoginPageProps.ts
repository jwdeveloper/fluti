import type {LoginFormData, LoginPageProps} from "$lib/fluti/pages/login/loginPageTypes";
import {useUserSession} from "$lib/fluti/services/userSessionController.svelte";
import {pocketbaseClient} from "$lib/pocketbase-client";


let session = useUserSession()
let handleUserLogin = async (data: LoginFormData) => {
    const authData = await pocketbaseClient
        .collection('users')
        //@ts-ignore
        .authWithPassword(data.email, data.password);

    session.setSession(authData.token, authData.record);

    document.cookie += pocketbaseClient.authStore.exportToCookie()
    session.redirectTo("/")
    return true;
}

let handleSendRecoveryMail = async (data: LoginFormData) => {
    if (!data.email)
        return false;

    let result = await pocketbaseClient
        .collection('users')
        .requestPasswordReset(data.email)
    return result;
}

let handleOAuthLogin = async (provider: string) => {

    const authProviders = await pocketbaseClient.collection('users').listAuthMethods();
    if (!authProviders.oauth2.enabled)
        throw new Error("OAuth disabled!")

    const oauthProvider = authProviders.oauth2
        .providers
        .find(e => e.name === provider.toLowerCase())
    if (!oauthProvider)
        throw new Error("OAuth provider " + provider + " not found!")

    const redirectUrl = `${window.location.origin}/oauth/${provider.toLowerCase()}`;
    const authUrl = oauthProvider.authURL;
    const state = oauthProvider.state;
    const verifier = oauthProvider.codeVerifier;

    document.cookie = `oauth_state=${encodeURIComponent(state)}; path=/; Secure; SameSite=Lax`;
    document.cookie = `oauth_verifier=${encodeURIComponent(verifier)}; path=/; Secure; SameSite=Lax`;

    const fullUrl = `${authUrl}${encodeURIComponent(redirectUrl)}`;
    window.location.href = fullUrl;
    return false;
}

let handleUserRegister = async (data: LoginFormData) => {
    await pocketbaseClient.collection('users').create({
        email: data.email,
        name: data.email,
        password: data.password,
        passwordConfirm: data.password
    });
    return true;
}

let handleUserSendVerificationEmail = async (data: LoginFormData) => {
    //@ts-ignore
    return await pocketbaseClient.collection('users').requestVerification(data.email)
}

let handleUserCheckVerification = async (data: LoginFormData) => {
    const authData = await pocketbaseClient
        .collection('users')
        //@ts-ignore
        .authWithPassword(data.email, data.password);
    return authData.record.verified;
}


export function pocketbaseLoginPageProps(props?: LoginPageProps): LoginPageProps {
    //@ts-ignore
    let pocketbaseProps: LoginPageProps = {
        onOAuthLogin: handleOAuthLogin,
        onSendVerification: handleUserSendVerificationEmail,
        onCheckVerification: handleUserCheckVerification,
        onSendRecoveryMail: handleSendRecoveryMail,
        onRegister: handleUserRegister,
        onLogin: handleUserLogin
    }

    return {...pocketbaseProps, ...props}
}