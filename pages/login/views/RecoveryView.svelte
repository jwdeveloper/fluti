<script lang="ts">
    import ButtonLogin from "../components/ButtonLogin.svelte";

    import Panel from "$lib/fluti/components/panel/Panel.svelte";
    import TitleLogin from "../components/TitleLogin.svelte";
    import type {LoginViewProps} from "../loginWindowTypes";
    import FormFieldsLogin from "../components/FormFieldsLogin.svelte";
    import Title from "$lib/fluti/components/title/Title.svelte";
    import {onMount} from "svelte";

    let {controller, translation}: LoginViewProps = $props();

    let isRecoveryView = $state(true)

    onMount(() => {
        isRecoveryView = true
    })

    const handleClick = async () => {
        let result = await controller.sendRecoveryMail();
        if (!result) {
            return
        }
        isRecoveryView = false;
    }

</script>

{#snippet RecoveryView()}
    <TitleLogin title={translation.recovery.title}
                icon="fa fa-envelope"
                description={translation.recovery.description}
    />

    <FormFieldsLogin controller={controller}
                     transition={translation}
                     enablePassword={false}
                     enableRepeatPassword={false}
    />
    <Panel width="100%" padding="0">
        <ButtonLogin onButtonClick={handleClick}
                     actionTitle="Powrót do logowania"
                     onActionClick={()=> controller.view = "login"}
                     title="Wyślij na email"/>
    </Panel>

{/snippet}

{#snippet GoBackView()}

    <TitleLogin title="Wysłano wiadomość"
                icon="fa fa-envelope"
                description="Wiadomość z linkiem do resetu hasła została wysłana na twój maila"
    />
    <Panel width="100%">
        <i class="fa fa-envelope" style="font-size: 4em"></i>
    </Panel>
    <Panel width="100%" padding="0">
        <ButtonLogin onButtonClick={()=> controller.view = "login"}
                     title="Powrót do logowania"/>
    </Panel>
{/snippet}

<Panel padding="0" width="100%" height="100%"
       align="space-around" justify="space-evenly"
       gap="0"
       direction="column">


    <Panel padding="0" direction="column" gap="1em">
        {#if isRecoveryView}
            <RecoveryView/>
        {:else}
            <GoBackView/>
        {/if}
    </Panel>
</Panel>
