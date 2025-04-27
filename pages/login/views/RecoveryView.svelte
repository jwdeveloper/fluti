<script lang="ts">
    import ButtonLogin from "../components/ButtonLogin.svelte";
    import TitleLogin from "../components/TitleLogin.svelte";
    import type {LoginViewProps} from "../loginPageTypes";
    import FormFieldsLogin from "../components/FormFieldsLogin.svelte";
    import {onMount} from "svelte";
    import Element from "$lib/fluti/components/panel/Element.svelte";

    let {controller}: LoginViewProps = $props();

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

    let translations = controller.props.messages.recoveryView;

</script>

{#snippet RecoveryView()}
    <TitleLogin title={translations.top.title}
                icon="fa fa-envelope"
                description={translations.top.subtitle}
    />


    <FormFieldsLogin controller={controller}
                     enablePassword={false}
                     enableRepeatPassword={false}
    />
    <Element width="100%" padding="0">
        <ButtonLogin onButtonClick={handleClick}
                     actionTitle="Powrót do logowania"
                     onActionClick={()=> controller.view = "login"}
                     title="Wyślij na email"/>
    </Element>

{/snippet}

{#snippet GoBackView()}

    <TitleLogin title="Wysłano wiadomość"
                icon="fa fa-envelope"
                description="Wiadomość z linkiem do resetu hasła została wysłana na twój maila"
    />
    <Element width="100%">
        <i class="fa fa-envelope" style="font-size: 4em"></i>
    </Element>
    <Element width="100%" padding="0">
        <ButtonLogin onButtonClick={()=> controller.view = "login"}
                     title={translations.button.title}
                     actionTitle={translations.button.subtitle}/>
    </Element>
{/snippet}

<Element padding="0" width="100%" height="100%"
       align="space-around" justify="space-evenly"
       gap="0"
       direction="column">


    <Element padding="0" direction="column" gap="1em">
        {#if isRecoveryView}
            {@render RecoveryView()}
        {:else}
            <GoBackView/>
        {/if}
    </Element>
</Element>
