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


export interface LoginWindowProps {


    //true
    oAuth?: boolean

    onLogin?: (data: LoginFormData) => void
    onOAuthLogin?: (provider: string) => void
    onRegister?: (data: LoginFormData) => void
    onRecovery?: (data: LoginFormData) => void
    onCheckVerification?: (data: LoginFormData) => void
    onSendVerification?: (data: LoginFormData) => void
    onSendRecoveryMail?: (data: LoginFormData) => void
}