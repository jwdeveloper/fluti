<script lang="ts">
    import {defaultTranslation} from "./data";
    import {useLoginController} from "./loginController.svelte";
    import LoginView from "./views/LoginView.svelte";
    import RegisterView from "./views/RegisterView.svelte";
    import EmailView from "./views/EmailView.svelte";
    import RecoveryView from "./views/RecoveryView.svelte";
    import type {LoginPageProps} from "./loginPageTypes";

    const props: LoginPageProps = $props();

    const defaultProps: LoginPageProps = {
        oAuth: {
            enable: true,
            providers: [
                {
                    name: "Google",
                    iconColor: "red",
                    // borderColor: "red",
                    onlyIcon: false
                },
                {
                    name: "Facebook",
                    iconColor: "#1877F2",
                    // borderColor: "#1877F2",
                    onlyIcon: true,
                    enabled: false,
                },
                {
                    name: "Discord",
                    iconColor: "#5865F2",
                    // borderColor: "#5865F2",
                    onlyIcon: true
                },
                {
                    name: "Github",
                    iconColor: "#2f3034",
                    borderColor: "#ffffff",
                    onlyIcon: true
                },

            ]
        },
        links: {
            privacyPolicy: '/privacy-policy',
            termsAndCondition: '/terms-and-conditions',
            error: '/error',
            login: '/login',
            page: '/'
        }
    }


    const mergedData = {...defaultProps, ...props}
    const data: LoginPageProps = {
        oAuth: {...defaultProps?.oAuth, ...props?.oAuth},
        templates: {...defaultProps?.templates, ...props?.templates},
        links: {...defaultProps?.links, ...props?.links},
        messages: {...defaultTranslation, ...props?.messages}
    }
    const finalData = {...mergedData, ...data}

    const controller = useLoginController(finalData);
    const currentView = $derived.by(() => {
        switch (controller.view) {
            case "login":
                return LoginView;
            case "register":
                return RegisterView;
            case "recovery":
                return RecoveryView;
            case "email":
                return EmailView;
            default:
                return LoginView;
        }
    })

</script>


<svelte:component this="{currentView}"
                  controller={controller}
                  translation={data.messages}/>
