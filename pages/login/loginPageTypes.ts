import type {LoginController} from "./loginController.svelte";
import type {i18Section} from "$lib/fluti/services/i18/translateTypes";

export interface LoginResponse {
    message?: string
    error?: boolean
    token: string
    dbToken: string
}

export interface LoginFormData {
    email?: string
    password?: string
    confirmPassword?: string
    acceptPolicy?: boolean
    acceptTerms?: boolean
}

export interface LoginViewProps {
    controller: LoginController
    translation: any
}

export interface OAuthProvider {
    name: string
    iconColor: string,
    borderColor?: string,
    onlyIcon: boolean //shows only icons with name
    enabled?: boolean
}


export interface LoginPagePropsTranslations {
    oAuthPrefix?: string
    loginButton?: string
    forgetPassword?: string
    continue?: string
    register?: string
    subtitle?: string
    invalidLoginOrPassword?: string

    form: {
        email: i18Section
        password: i18Section
        repeatPassword: i18Section
    }

    registerView: {
        top: i18Section
        button: i18Section
        iAgreeTo: string

        fieldCanNotBeEmpty: string,
        passwordsDoesNotMatch: string,
        userAlreadyExists: string
        youMustAccept: string
    }

    emailView: {
        top: i18Section
        center: i18Section
        button: i18Section
    }

    recoveryView: {
        top: i18Section
        button: i18Section
    }

    loginView: {
        rules: {
            accept: string,
            terms: string,
            policy: string
        },
        oauth: {
            continue: string
        }
        top: i18Section
        button: i18Section
        forgotPassword: string
        or: string
    }
}

export interface LoginPageProps {

    oAuth?: {
        enable?: boolean
        direction?: 'default' | 'vertical'
        providers?: OAuthProvider[],
    }

    emailAuth?: {
        enabled?: boolean
    }

    templates?: {
        logoTemplate?: any
        oAuthProviderTemplate?: any
        pageRightWindowTemplate?: any
    }

    messages: LoginPagePropsTranslations,
    redirectUrl?: string

    links?: {
        logo: string
        termsAndCondition?: string
        privacyPolicy?: string
        login?: string
        error?: string
        page?: string
    }

    enableRecovery: boolean
    enablePrivacy: boolean
    enableCreateAccount: boolean

    onLogin?: (data: LoginFormData, controller: LoginController) => void
    onError?: (data: LoginFormData, controller: LoginController, error: any) => void
    onOAuthLogin?: (provider: string) => void
    onRegister?: (data: LoginFormData) => void
    onRecovery?: (data: LoginFormData) => void
    onCheckVerification?: (data: LoginFormData) => void
    onSendVerification?: (data: LoginFormData) => void
    onSendRecoveryMail?: (data: LoginFormData) => void
}