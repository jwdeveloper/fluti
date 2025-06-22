<script lang="ts">
    import {defaultTranslation} from "./data";
    import {useLoginController} from "./loginController.svelte";
    import LoginView from "./views/LoginView.svelte";
    import RegisterView from "./views/RegisterView.svelte";
    import EmailView from "./views/EmailView.svelte";
    import RecoveryView from "./views/RecoveryView.svelte";
    import type {LoginPageProps} from "./loginPageTypes";
    import {onMount} from "svelte";
    import {useAlert} from "$lib/fluti/widgets/alert/AlertImpl.svelte";

    const props: LoginPageProps = $props();

    const defaultProps: LoginPageProps = {
        emailAuth: {
            enabled: true
        },
        enableRecovery: true,
        enableCreateAccount: true,
        enablePrivacy: true,
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
            page: '/',
            logo: "/logo.png"
        }
    }


    const mergedData = {...defaultProps, ...props}
    const data: LoginPageProps = {
        emailAuth: {...defaultProps?.emailAuth, ...props?.emailAuth},
        oAuth: {...defaultProps?.oAuth, ...props?.oAuth},
        templates: {...defaultProps?.templates, ...props?.templates},
        links: {...defaultProps?.links, ...props?.links},
        messages: {...defaultTranslation, ...props?.messages},
        enableCreateAccount: props?.enableCreateAccount ?? true,
        enableRecovery: props?.enableRecovery ?? true,
        enablePrivacy: props?.enablePrivacy ?? true
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


    onMount(() => {
        if (window.location.href.includes("error="))
            useAlert().pushAlert("Unexpected error while creating account")
    })
</script>


<svelte:component this="{currentView}"
                  controller={controller}
                  translation={data.messages}/>
