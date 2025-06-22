import type {LoginPagePropsTranslations} from "$lib/fluti/pages/login/loginPageTypes";

export let defaultTranslation: LoginPagePropsTranslations = {

    emailView: {
        top: {
            title: "Almost done",
            subtitle: "Message with confirmation link has been send to your email",
        },
        center: {
            title: "Waiting for confirmation",
            subtitle: "Check your email and confirm code to finalize registration. If you can't see mail check your spam folder.",
        },
        button: {
            title: "Send again",
            subtitle: "Back to login"
        }
    },

    registerView: {
        top: {
            title: "Create a New Account",
            subtitle: "Join our community today!",
        },
        iAgreeTo: "I agree to the ",
        youMustAccept: "You must accept to register",
        button: {
            title: "Register",
            subtitle: "Return to Login",
        },
        fieldCanNotBeEmpty: "This field cannot be empty.",
        passwordsDoesNotMatch: "Passwords do not match.",
        userAlreadyExists: 'This email is already taken'
    },

    loginView: {
        oauth: {
            continue: 'Continue with'
        },
        top: {
            title: '',
            subtitle: ''
        },
        rules: {
            accept: "By continuing, you agree to",
            terms: 'Terms of service',
            policy: 'Privacy policy'
        },
        button: {
            title: 'Continue',
            subtitle: 'Create a new account'
        },
        or: "or",
        forgotPassword: "I've forgot my password",
    },

    recoveryView: {
        top: {
            title: 'Forgot password?',
            subtitle: "Don't worry we will send you recovery email"
        },
        button: {
            title: "Send",
            subtitle: "Back to login"
        }
    },

    form: {
        email: {
            invalidEmail: "Invalid email",
            title: 'Email',
            subtitle: 'Enter email address'
        },
        password: {
            title: 'Password',
            subtitle: 'Enter password'
        },
        repeatPassword: {
            title: "Repeat password",
            subtitle: 'Repeat password'
        }
    }
}