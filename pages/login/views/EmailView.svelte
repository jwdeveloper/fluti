<script lang="ts">
    import ButtonLogin from "../components/ButtonLogin.svelte";
    import TitleLogin from "../components/TitleLogin.svelte";
    import type {LoginViewProps} from "../loginPageTypes";
    import {onMount} from "svelte";
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import Space from "$lib/fluti/components/space/Space.svelte";

    let data: LoginViewProps = $props();
    let timeout = $state(0);
    let taskId: any = $state(0);

    const translation = data.controller.props.messages.emailView
    let handleSendVerificationEmail = async () => {
        if (timeout > 0)
            return
        await data.controller.sendVerificationMail();
        timeout = 5;
        const interval = setInterval(() => {
            timeout -= 1;
            if (timeout <= 0) {
                clearInterval(interval);
            }
        }, 3000);
    }

    let handleCheckEmailConfirmed = async () => {
        let result = await data.controller.checkUserVerification();
        if (result) {
            clearInterval(taskId)
            await data.controller.login();
        }
    }

    onMount(() => {
        taskId = setInterval(() => {
            handleCheckEmailConfirmed();
        }, 5000)

        handleSendVerificationEmail();

        return () => {
            clearInterval(taskId)
        }
    })

    let getButtonProps = $derived.by(() => {
        timeout
        return {
            disabled: timeout > 0
        }
    })

    let getButtonTitle = $derived.by(() => {
        timeout
        if (timeout > 0) {
            return `${translation.button.title} (${timeout})`
        }
        return translation.button.title
    })


</script>


<Element width="auto" height="100%" direction="column" gap="2em" padding="2em 0 0 0">

    <TitleLogin title={translation.top.title}
                description={translation.top.subtitle}
                icon="fa fa-envelope"
    />
    <Space variant="tiny"/>
    <Element direction="column" width="100%" gap="2em" padding="0 2em">
        <h1 class=" fa fa-spinner fa-spin" style="font-size: 3em"/>
        <h5 style="text-align: center; font-weight: normal">{translation.center.subtitle}</h5>
    </Element>
    <Space variant="tiny"/>

    <ButtonLogin title={getButtonTitle}
                 onButtonClick={handleSendVerificationEmail}
                 onActionClick={()=>data.controller.view = 'login'}
                 buttonProps={getButtonProps}
                 actionTitle={translation.button.subtitle}/>
</Element>