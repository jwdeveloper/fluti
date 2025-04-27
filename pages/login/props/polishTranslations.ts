import type {LoginPagePropsTranslations} from "$lib/fluti/pages/login/loginPageTypes";

export let loginPagePolishTranslations: LoginPagePropsTranslations = {



    emailView: {
        top: {
            title: "Prawie gotowe",
            subtitle: "Wiadomość z linkiem potwierdzającym została wysłana na Twój e-mail",
        },
        center: {
            title: "Oczekiwanie na potwierdzenie",
            subtitle: "Sprawdź swoją skrzynkę e-mail i potwierdź kod, aby zakończyć rejestrację. Jeśli nie widzisz wiadomości, sprawdź folder spam.",
        },
        button: {
            title: "Wyślij ponownie",
            subtitle: "Powrót do logowania"
        }
    },

    registerView: {
        top: {
            title: "Utwórz nowe konto",
            subtitle: "Dołącz do naszej społeczności już dziś!",
        },
        iAgreeTo: "Zgadzam się na ",
        youMustAccept: "Musisz zaakceptować, aby się zarejestrować",
        button: {
            title: "Zarejestruj się",
            subtitle: "Powrót do logowania",
        },
        fieldCanNotBeEmpty: "To pole nie może być puste.",
        passwordsDoesNotMatch: "Hasła nie pasują do siebie.",
        userAlreadyExists: "Ten e-mail jest już zajęty."
    },

    loginView: {
        oauth: {
            continue: "Kontynuuj przez"
        },
        top: {
            title: '',
            subtitle: "Utwórz darmowe konto i dołącz do naszej społeczności!"
        },
        rules: {
            accept: "Kontynuując, akceptujesz",
            terms: "Regulamin",
            policy: "Politykę prywatności"
        },
        button: {
            title: "Kontynuuj",
            subtitle: "Utwórz nowe konto"
        },
        or: "lub",
        forgotPassword: "Nie pamiętasz hasła?",
    },

    recoveryView: {
        top: {
            title: "Zapomniałeś hasła?",
            subtitle: "Nie martw się, wyślemy ci e-mail z linkiem do odzyskania hasła."
        },
        button: {
            title: "Wyślij",
            subtitle: "Powrót do logowania"
        }
    },

    form: {
        email: {
            title: "E-mail",
            subtitle: "Wprowadź adres e-mail"
        },
        password: {
            title: "Hasło",
            subtitle: "Wprowadź hasło"
        },
        repeatPassword: {
            title: "Powtórz hasło",
            subtitle: "Powtórz hasło"
        }
    }
}