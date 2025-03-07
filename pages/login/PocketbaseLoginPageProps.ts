import type {LoginFormData, LoginPageProps, LoginResponse} from "$lib/fluti/pages/login/loginPageTypes";

import type {LoginController} from "$lib/fluti/pages/login/loginController.svelte";
import {useAlert} from "$lib/fluti/widgets/alert/AlertImpl.svelte";
//@ts-ignore
import userSession from "../../server2/middlewares/session/clientUserSession.svelte.ts";
import {pocketbaseClient} from "$lib/fluti/clients/pocketbase-client";

const alerts = useAlert()
const handleUserLogin = async (data: LoginFormData, controller: LoginController) => {
    let response = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({email: data.email, password: data.password})
    })
    let authData = await response.json() as LoginResponse;
    if (authData.error) {
        alerts.pushAlert(authData?.message ?? 'Error while login', 'error');
        return
    }
    userSession.loadSession();
    userSession.redirectTo(controller?.props?.redirectUrl ?? "/")
    return true;
}

const handleError = async (data: LoginFormData, controller: LoginController, error: any) => {
    if (error.message === 'Failed to authenticate.') {
        controller.error = ''
        controller.invalidFields['password'] = controller?.props?.messages?.invalidLoginOrPassword ?? error.message;
    }
    if (error.message === 'Failed to create record.') {
        if (!error?.data) {
            return
        }
        controller.error = ''
        let data = error.data.data
        if (data?.email) {
            controller.invalidFields['email'] = data.email.message;
            if (data?.email.code === 'validation_not_unique') {
                controller.invalidFields['email'] = controller?.props?.messages?.registerView.userAlreadyExists;
            }
            return
        }

        if (data?.password) {
            controller.invalidFields['email'] = ''
            controller.invalidFields['password'] = data.password.message;
            return
        }
        controller.error = error.message
    }
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
    const response = await fetch(`/api/auth/oauth/create/${provider}`)
    const json = await response.json()
    window.location.href = json.url;
    return false;
}

let handleUserRegister = async (data: LoginFormData) => {
    let response = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
            email: data.email,
            password: data.password,
            passwordConfirm: data.password
        })
    })
    let responseData = await response.json();
    if (responseData.error) {
        alerts.pushAlert(responseData?.message ?? 'Error while register', 'error');
        return false;
    }
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
        onLogin: handleUserLogin,
        onError: handleError
    }

    return {...pocketbaseProps, ...props}
}