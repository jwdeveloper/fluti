import type {LoginPagePropsTranslations} from "$lib/fluti/pages/login/loginPageTypes";

export let loginData = {
    title: "ESC00L logowanie",
    rememberMe: "Zapamiętaj mnie",
    forgotPassword: "Zapomniałeś hasła?",
    continue: "Kontynuuj",
    signIn: "Zaloguj się",
    alternative: "Albo",
    password: "Hasło",
    loginOrEmail: "Email lub nazwa konta",


    recovery: {
        title: "Zapomniałeś hasła?",
        description: "Bez obaw, wyślemy Ci link do zresetowania hasła.",
    }
}

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
        iAcceptTerms: "I agree to the Terms and Conditions of Service.",
        iAcceptPolicy: "I agree to the Privacy Policy.",
        youMustAccept:"You must accept to register",
        button: {
            title: "Register",
            subtitle: "Return to Login",
        },
        fieldCanNotBeEmpty: "This field cannot be empty.",
        passwordsDoesNotMatch: "Passwords do not match.",
        userAlreadyExists: 'This email is already taken'
    }

}