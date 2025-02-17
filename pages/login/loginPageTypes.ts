import type {LoginController} from "./loginController.svelte";

export interface LoginFormData {
    email?: string
    password?: string
    confirmPassword?: string
    acceptRules?: boolean
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

    messages?: {
        oAuthPrefix?: string
        loginButton?: string
        forgetPassword?: string
        continue?: string
        register?: string
        subtitle?: string
    }

    links?: {
        termsAndCondition?: string
        privacyPolicy?: string
        login?: string
        error?: string
        page?: string
    }

    onLogin?: (data: LoginFormData) => void
    onOAuthLogin?: (provider: string) => void
    onRegister?: (data: LoginFormData) => void
    onRecovery?: (data: LoginFormData) => void
    onCheckVerification?: (data: LoginFormData) => void
    onSendVerification?: (data: LoginFormData) => void
    onSendRecoveryMail?: (data: LoginFormData) => void
}