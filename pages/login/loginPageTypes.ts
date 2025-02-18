import type {LoginController} from "./loginController.svelte";
import type {i18Section} from "$lib/fluti/services/i18/translateTypes";

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
}


export interface LoginPagePropsTranslations {
    oAuthPrefix?: string
    loginButton?: string
    forgetPassword?: string
    continue?: string
    register?: string
    subtitle?: string
    invalidLoginOrPassword?: string

    registerView: {
        top: i18Section
        button: i18Section
        iAcceptTerms: string
        iAcceptPolicy: string,

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
}

export interface LoginPageProps {

    oAuth?: {
        enable?: boolean
        providers?: OAuthProvider[],
    }

    templates?: {
        logoTemplate?: any
        oAuthProviderTemplate?: any
        pageRightWindowTemplate?: any
    }

    messages: LoginPagePropsTranslations,

    links?: {
        termsAndCondition?: string
        privacyPolicy?: string
        login?: string
        error?: string
        page?: string
    }

    onLogin?: (data: LoginFormData) => void
    onError?: (data: LoginFormData, controller: LoginController, error: any) => void
    onOAuthLogin?: (provider: string) => void
    onRegister?: (data: LoginFormData) => void
    onRecovery?: (data: LoginFormData) => void
    onCheckVerification?: (data: LoginFormData) => void
    onSendVerification?: (data: LoginFormData) => void
    onSendRecoveryMail?: (data: LoginFormData) => void
}