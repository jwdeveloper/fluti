import type {LoginFormData, LoginWindowProps} from "./loginWindowTypes";

export class LoginController {
    view: 'login' | 'register' | 'recovery' | 'email' | 'error' = $state('login')
    isLoading = $state(false)
    error = $state('')
    form: LoginFormData = $state({})
    props: LoginWindowProps = $state({})
    invalidFields: Record<string, any> = $state({})

    constructor() {
        this.reset()
        this.props = {
            oAuth: true
        }
    }

    reset() {
        this.form = {
            email: '',
            password: '',
            confirmPassword: '',
            acceptRules: false
        }
        this.invalidFields = {}
        this.view = 'login'
        this.error = ''
    }

    validate() {
        this.invalidFields = {}
        if (!this.form.email) {
            this.invalidFields.email = "login is required"
            throw new Error("Mail can not be empty!")
        }
        if (this.view != 'recovery' && !this.form.password) {
            this.invalidFields.password = "password is required"
            throw new Error("Password must not be empty")
        }
        return true;
    }

    async executeAction(action: any) {
        if (action === undefined)
            return

        let status = true;
        this.isLoading = true;
        try {
            this.validate();
            await action(this.form);
        } catch (e) {
            this.error = e + "";
            status = false;
        }
        this.isLoading = false;
        return status;
    }

    async login() {
        return this.executeAction(this.props.onLogin);
    }

    async register() {
        return this.executeAction(this.props.onRegister);
    }

    async recovery() {
        return this.executeAction(this.props.onRecovery);
    }

    async sendVerificationMail() {
        return this.executeAction(this.props.onSendVerification);
    }


    async sendRecoveryMail() {
        return this.executeAction(this.props.onSendRecoveryMail);
    }

    async checkUserVerification() {
        try {
            if (this.props.onCheckVerification) {
                return await this.props.onCheckVerification(this.form);
            }
        } catch (e) {
            this.error = e + "";
        }
        return false;
    }

    async loginOAuth(provider: string) {
        try {
            if (this.props.onOAuthLogin) {
                return await this.props.onOAuthLogin(provider);
            }
        } catch (e) {
            this.error = e + "";
        }
        return false;

    }
}

export let useLoginController = () => {
    return new LoginController();
}