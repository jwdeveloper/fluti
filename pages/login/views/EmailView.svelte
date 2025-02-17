<script lang="ts">
    import Panel from "$lib/fluti/components/panel/Panel.svelte";
    import ButtonLogin from "../components/ButtonLogin.svelte";
    import TitleLogin from "../components/TitleLogin.svelte";
    import type {LoginViewProps} from "../loginPageTypes";
    import Separator from "$lib/fluti/components/separator/Separator.svelte";
    import {onMount} from "svelte";

    let data: LoginViewProps = $props();
    let timeout = $state(0);
    let taskId: any = $state(0);

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
        }, 1000);
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


</script>


<Panel width="250px" height="100%" direction="column" gap="2em" padding="2em 0 0 0">


    <TitleLogin title="Prawie gotowe"
                description="Wiadomość została wysłana na twój maila"
                icon="fa fa-envelope"
    />

    <Panel direction="column" variant="component-panel-border-dark" width="100%" height="150px">
        <i class="fa fa-envelope" style="font-size: 5em;"/>
        <i class=" fa fa-spinner fa-spin" style="font-size: 2em;"></i>
        <div>Oczekiwanie na potwierdzenie</div>
    </Panel>

    <Separator></Separator>

    <ButtonLogin title="Wyślij ponownie ({timeout})"
                 onButtonClick={handleSendVerificationEmail}
                 onActionClick={()=>data.controller.view = 'login'}
                 actionTitle="Powrót do logowania"/>

</Panel>